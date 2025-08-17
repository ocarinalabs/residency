"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useCallback } from "react";
import { Loader2, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Calendar24 } from "@/components/ui/calendar-date";
import { HiddenNuveqForm } from "./hidden-nuveq-form";

const formSchema = z.object({
  fullName: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  icPassport: z.string().min(6, {
    message: "IC/Passport must be at least 6 characters.",
  }),
  phoneNumber: z
    .string()
    .min(10, {
      message: "Phone number must be at least 10 digits.",
    })
    .regex(/^\d+$/, {
      message: "Phone number must contain only numbers.",
    }),
  visitDate: z.string().min(1, {
    message: "Please select a visit date.",
  }),
  startTime: z.string().min(1, {
    message: "Please select a start time.",
  }),
  vehicleNumber: z.string().optional(),
  reasonToVisit: z.string().min(5, {
    message: "Please provide a reason for your visit.",
  }),
  selectedRoom: z.string().optional(),
});

export function VisitorRegistrationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter();
  const [submitData, setSubmitData] = useState<{
    fullName: string;
    email: string;
    icPassport: string;
    phoneNumber: string;
    visitDate: string;
    startTime: string;
    vehicleNumber?: string;
    reasonToVisit: string;
    selectedRoom?: string;
  } | null>(null);
  const [showIframe, setShowIframe] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      icPassport: "",
      phoneNumber: "",
      visitDate: "",
      startTime: "10:00",
      vehicleNumber: "",
      reasonToVisit: "500 Social House @ AI Residency",
      selectedRoom: "",
    },
  });

  // Auto-fill form from localStorage on page load
  useEffect(() => {
    const localData = localStorage.getItem("visitorRegistrationData");
    if (localData) {
      try {
        const parsed = JSON.parse(localData);
        form.setValue("fullName", parsed.fullName || "");
        form.setValue("email", parsed.email || "");
        form.setValue("icPassport", parsed.icPassport || "");
        form.setValue("phoneNumber", parsed.phoneNumber || "");
        form.setValue("vehicleNumber", parsed.vehicleNumber || "");
        form.setValue(
          "reasonToVisit",
          parsed.reasonToVisit || "500 Social House @ AI Residency"
        );
        if (parsed.selectedRoom) {
          form.setValue("selectedRoom", parsed.selectedRoom);
        }
        // Silent auto-fill, no toast
      } catch (e) {
        console.error("Failed to parse local storage data", e);
      }
    }
  }, [form]);

  const handleFormComplete = useCallback(() => {
    setIsLoading(false);
    setIsSubmitted(true);
    // Clear form data after submission
    setSubmitData(null);
    setShowIframe(false);
  }, []);

  const handleDateTimeChange = useCallback(
    (date: string, time: string) => {
      form.setValue("visitDate", date);
      form.setValue("startTime", time);
      form.clearErrors(["visitDate", "startTime"]);
    },
    [form]
  );

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("📝 Form submitted with values:", values);
    setIsLoading(true);

    // Always save to localStorage for next time
    localStorage.setItem(
      "visitorRegistrationData",
      JSON.stringify({
        fullName: values.fullName,
        email: values.email,
        icPassport: values.icPassport,
        phoneNumber: values.phoneNumber,
        vehicleNumber: values.vehicleNumber,
        reasonToVisit: values.reasonToVisit,
        selectedRoom: values.selectedRoom,
      })
    );
    console.log("💾 Saved to localStorage");

    // Set the data to trigger the hidden form submission
    const submitPayload = {
      fullName: values.fullName,
      email: values.email,
      icPassport: values.icPassport,
      phoneNumber: values.phoneNumber,
      visitDate: values.visitDate,
      startTime: values.startTime,
      vehicleNumber: values.vehicleNumber,
      reasonToVisit: values.reasonToVisit,
      selectedRoom: values.selectedRoom,
    };

    console.log("🎯 Triggering hidden form with payload:", submitPayload);
    setSubmitData(submitPayload);

    // The form will submit in the background
    // We'll show loading for a reasonable time
    setTimeout(() => {
      console.log("⏱️ Timer complete, showing success message");
      setIsLoading(false);
      setIsSubmitted(true);
      // Clear form data after submission
      setSubmitData(null);
      setShowIframe(false);
    }, 3000);
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-card rounded-lg border">
      {isSubmitted ? (
        // Success state
        <div className="flex flex-col items-center justify-center py-8 space-y-4">
          <CheckCircle className="h-16 w-16 text-green-500" />
          <h2 className="text-2xl font-bold text-center">Form Submitted!</h2>
          <p className="text-sm text-muted-foreground text-center px-4">
            Check your email for the visitor pass link. You should receive it
            within a few minutes.
          </p>
          <Button onClick={() => router.push("/pass")} className="mt-4">
            Go to Pass
          </Button>
        </div>
      ) : (
        // Form state
        <>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-center">
              Visitor Registration
            </h2>
            <p className="text-sm text-muted-foreground text-center mt-2">
              Register to receive your digital visitor pass
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Full Name
                      <span className="text-red-500 align-top text-xs">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Khailee Ng"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Email Address
                      <span className="text-red-500 align-top text-xs">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="visitor@example.com"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="icPassport"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      IC/Passport
                      <span className="text-red-500 align-top text-xs">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="A12345678"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Phone Number
                      <span className="text-red-500 align-top text-xs">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="0123456789"
                        {...field}
                        onChange={(e) => {
                          // Only allow numbers
                          const numbersOnly = e.target.value.replace(/\D/g, "");
                          field.onChange(numbersOnly);
                        }}
                        pattern="[0-9]*"
                        inputMode="numeric"
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Visit Date */}
              <div className="space-y-2">
                <Calendar24 onDateTimeChange={handleDateTimeChange} />
                <p className="text-sm text-muted-foreground">
                  Your visit ends at 11:59 PM on the selected date
                </p>
                {(form.formState.errors.visitDate ||
                  form.formState.errors.startTime) && (
                  <p className="text-sm text-destructive">
                    Please select a visit date and time
                  </p>
                )}
              </div>

              {/* Room Selection Section - Commented out for now */}
              {/* <FormField
            control={form.control}
            name="selectedRoom"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select a Room</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={isLoading}
                  >
                    <option value="">No room selected</option>
                    <option value="singapore">Singapore</option>
                    <option value="bangkok">Bangkok</option>
                    <option value="tokyo">Tokyo</option>
                    <option value="seoul">Seoul</option>
                    <option value="abu-dhabi">Abu Dhabi</option>
                    <option value="cairo">Cairo</option>
                    <option value="riyadh">Riyadh</option>
                    <option value="miami">Miami</option>
                    <option value="davos">Davos</option>
                    <option value="london">London</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}

              {/* Additional Details Section */}
              <div className="space-y-2 pt-2">
                <h3 className="text-sm font-semibold">Additional Details</h3>
              </div>

              <FormField
                control={form.control}
                name="vehicleNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vehicle Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="BMT 216A"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reasonToVisit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Reason for Visit
                      <span className="text-red-500 align-top text-xs">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="AI Residency @ 500 Social House"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Registering...
                  </>
                ) : (
                  "Register for Visitor Pass"
                )}
              </Button>
            </form>
          </Form>

          {/* Toggle to show iframe */}
          <div className="mt-4 flex items-center space-x-2">
            <input
              type="checkbox"
              id="show-iframe"
              checked={showIframe}
              onChange={(e) => setShowIframe(e.target.checked)}
              className="h-4 w-4"
            />
            <label
              htmlFor="show-iframe"
              className="text-sm text-muted-foreground"
            >
              Show submission iframe (for debugging)
            </label>
          </div>

          {/* Hidden form that submits to Nuveq */}
          <HiddenNuveqForm
            formData={submitData || undefined}
            onComplete={handleFormComplete}
            visible={showIframe}
          />
        </>
      )}
    </div>
  );
}
