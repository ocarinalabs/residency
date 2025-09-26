import { sessionManager } from "./session";
import { NUVEQ_PATHS, QUERY_TIMEOUTS } from "./constants";

export interface Visitor {
  name: string;
  company: string;
  site: string;
  visitFrom: string;
  visitTill: string;
  visitorType: string;
  credential: string;
  invitedBy: string;
  vehicleNumber: string;
  reasonForVisit: string;
  approvedBy: string;
  photo?: string;
}

export type VisitorType = "today" | "future" | "pending";

class NuveqScraper {
  private buildScrapeQuery(pageUrl: string): string {
    return `
      mutation ScrapeVisitors {
        goto(url: "${pageUrl}", waitUntil: networkIdle) {
          status
        }

        waitForTable: waitForSelector(selector: "table", timeout: ${QUERY_TIMEOUTS.TABLE_WAIT_MS}) {
          time
        }

        checkNoData: evaluate(content: "
          const noDataElement = document.querySelector('.dataTables_empty');
          return noDataElement ? noDataElement.textContent : null;
        ") {
          value
        }

        scrapeData: evaluate(content: "
          const rows = Array.from(document.querySelectorAll('table tbody tr'));

          if (rows.length === 1) {
            const firstRow = rows[0];
            if (firstRow.querySelector('.dataTables_empty') ||
                firstRow.textContent.includes('No data available')) {
              return [];
            }
          }

          return rows.map(row => {
            const cells = Array.from(row.querySelectorAll('td'));

            if (cells.length === 1 && cells[0].textContent.includes('No data')) {
              return null;
            }

            return {
              name: cells[0]?.textContent?.trim() || '',
              photo: cells[1]?.querySelector('img')?.src || '',
              company: cells[2]?.textContent?.trim() || '',
              site: cells[3]?.textContent?.trim() || '',
              visitFrom: cells[4]?.textContent?.trim() || '',
              visitTill: cells[5]?.textContent?.trim() || '',
              visitorType: cells[6]?.textContent?.trim() || '',
              credential: cells[7]?.textContent?.trim() || '',
              invitedBy: cells[8]?.textContent?.trim() || '',
              vehicleNumber: cells[9]?.textContent?.trim() || '',
              reasonForVisit: cells[10]?.textContent?.trim() || '',
              approvedBy: cells[11]?.textContent?.trim() || '',
            };
          }).filter(visitor => visitor !== null);
        ") {
          value
        }

        getPageTitle: title {
          title
        }
      }
    `;
  }

  async scrapeVisitors(type: VisitorType): Promise<Visitor[]> {
    const pageUrl = this.getPageUrl(type);
    console.log(`Scraping ${type} visitors from ${pageUrl}...`);

    const query = this.buildScrapeQuery(pageUrl);

    try {
      const data = await sessionManager.executeQuery(query) as {
        checkNoData?: { value: string };
        scrapeData?: { value: Visitor[] }
      };

      if (data.checkNoData?.value) {
        console.log(
          `No visitors found for ${type} (${data.checkNoData.value})`
        );
        return [];
      }

      const visitors = data.scrapeData?.value || [];
      console.log(`Found ${visitors.length} ${type} visitors`);

      return visitors;
    } catch (error) {
      console.error(`Failed to scrape ${type} visitors:`, error);
      throw new Error(
        `Failed to scrape ${type} visitors: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  private getPageUrl(type: VisitorType): string {
    const paths = {
      today: NUVEQ_PATHS.TODAY,
      future: NUVEQ_PATHS.FUTURE,
      pending: NUVEQ_PATHS.PENDING,
    };

    return `${NUVEQ_PATHS.BASE_URL}${paths[type]}`;
  }

  async scrapeAllVisitors(): Promise<{
    today: Visitor[];
    future: Visitor[];
    pending: Visitor[];
  }> {
    console.log("Scraping all visitor types...");

    try {
      const today = await this.scrapeVisitors("today");
      const future = await this.scrapeVisitors("future");
      const pending = await this.scrapeVisitors("pending");

      return { today, future, pending };
    } catch (error) {
      console.error("Failed to scrape all visitors:", error);
      throw error;
    }
  }

  getSessionInfo() {
    return sessionManager.getSessionInfo();
  }

  async closeSession() {
    await sessionManager.closeSession();
  }
}

export const nuveqScraper = new NuveqScraper();
