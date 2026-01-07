"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@residence/ui/components/shadcn/button";
import { Checkbox } from "@residence/ui/components/shadcn/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@residence/ui/components/shadcn/form";
import { Input } from "@residence/ui/components/shadcn/input";
import { CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Calendar24 } from "@/components/ui/calendar-date";

const VALIDATION = {
  FULL_NAME_MIN: 2,
  IC_PASSPORT_MIN: 6,
  PHONE_MIN_DIGITS: 10,
  REASON_MIN_LENGTH: 5,
  INVITED_BY_MIN_LENGTH: 2,
} as const;

const DEFAULTS = {
  REASON_TO_VISIT: "Co-working @ 500 Social House",
  COMPANY: "500 Social House",
} as const;

const VALIDATION_MESSAGES = {
  GUIDELINES_REQUIRED: "You must agree to the guidelines to register",
} as const;

const ROUTES = {
  GUIDE: "/guide",
} as const;

const formSchema = z.object({
  fullName: z.string().min(VALIDATION.FULL_NAME_MIN, {
    message: `Name must be at least ${VALIDATION.FULL_NAME_MIN} characters.`,
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  icPassport: z.string().min(VALIDATION.IC_PASSPORT_MIN, {
    message: `IC/Passport Number must be at least ${VALIDATION.IC_PASSPORT_MIN} characters.`,
  }),
  phoneNumber: z
    .string()
    .min(VALIDATION.PHONE_MIN_DIGITS, {
      message: `Phone number must be at least ${VALIDATION.PHONE_MIN_DIGITS} digits.`,
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
  reasonToVisit: z.string().min(VALIDATION.REASON_MIN_LENGTH, {
    message: "Please provide a reason for your visit.",
  }),
  company: z.string().optional(),
  invitedBy: z.string().min(VALIDATION.INVITED_BY_MIN_LENGTH, {
    message: "Please provide the name of the person who invited you.",
  }),
  selectedRoom: z.string().optional(),
  bookingDuration: z.string().optional(),
  agreeToGuidelines: z.boolean().refine((val) => val === true, {
    message: VALIDATION_MESSAGES.GUIDELINES_REQUIRED,
  }),
});

export function VisitorRegistrationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      icPassport: "",
      phoneNumber: "",
      visitDate: "",
      startTime: "10:00",
      vehicleNumber: "",
      reasonToVisit: DEFAULTS.REASON_TO_VISIT,
      company: "",
      invitedBy: "",
      selectedRoom: "",
      bookingDuration: "2",
      agreeToGuidelines: false,
    },
  });

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
        form.setValue("reasonToVisit", DEFAULTS.REASON_TO_VISIT);
        form.setValue("company", parsed.company || "");
        form.setValue("invitedBy", parsed.invitedBy || "");
        if (parsed.selectedRoom) {
          form.setValue("selectedRoom", parsed.selectedRoom);
        }
        if (parsed.bookingDuration) {
          form.setValue("bookingDuration", parsed.bookingDuration);
        }
        // biome-ignore lint/suspicious/noEmptyBlockStatements: localStorage parse failure is non-critical
      } catch {}
    }
  }, [form]);

  const handleDateTimeChange = useCallback(
    (date: string, time: string) => {
      form.setValue("visitDate", date);
      form.setValue("startTime", time);
      form.clearErrors(["visitDate", "startTime"]);
    },
    [form]
  );

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    localStorage.setItem(
      "visitorRegistrationData",
      JSON.stringify({
        fullName: values.fullName,
        email: values.email,
        icPassport: values.icPassport,
        phoneNumber: values.phoneNumber,
        vehicleNumber: values.vehicleNumber,
        company: values.company,
        invitedBy: values.invitedBy,
        selectedRoom: values.selectedRoom,
        bookingDuration: values.bookingDuration,
      })
    );

    try {
      const visitStart = new Date(`${values.visitDate}T${values.startTime}`)
        .toISOString()
        .replace(".000Z", "Z");
      const visitEnd = new Date(`${values.visitDate}T23:59`)
        .toISOString()
        .replace(".000Z", "Z");

      const payload = {
        name: values.fullName,
        email: values.email,
        userId: null,
        phone: values.phoneNumber,
        visitStart,
        visitEnd,
        vehicleNumber: values.vehicleNumber || null,
        reason: values.invitedBy
          ? `${values.reasonToVisit}_${values.invitedBy}`
          : values.reasonToVisit,
        companyName: values.company || DEFAULTS.COMPANY,
        inviterEmail: null,
        liftGroupId: null,
        userPhoto: null,
        isRepeatVisit: false,
      };

      const response = await fetch("/api/nuveq-proxy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      if (responseData.success) {
        toast.success(
          "Registration successful! Check your email for confirmation."
        );
        setIsLoading(false);
        setIsSubmitted(true);
      } else {
        let errorMessage = "Registration failed. ";
        if (responseData.data?.message) {
          errorMessage += responseData.data.message;
        } else if (responseData.data?.error) {
          errorMessage += responseData.data.error;
        } else {
          errorMessage += "Please try again or contact support.";
        }

        toast.error(errorMessage);
        setIsLoading(false);
      }
    } catch {
      toast.error("Network error. Please check your connection and try again.");
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-none border bg-card p-6">
      {isSubmitted ? (
        <div className="flex flex-col items-center justify-center space-y-4 py-8">
          <CheckCircle className="h-16 w-16 text-green-500" />
          <h2 className="text-center font-nineties text-2xl">
            registration complete!
          </h2>
          <p className="px-4 text-center text-muted-foreground text-sm">
            Check your email for confirmation.
          </p>
        </div>
      ) : (
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Full Name
                    <span className="align-top text-red-500 text-xs">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Doe"
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
                    <span className="align-top text-red-500 text-xs">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="visitor@example.com"
                      type="email"
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
                    IC/Passport Number
                    <span className="align-top text-red-500 text-xs">*</span>
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
                    <span className="align-top text-red-500 text-xs">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="0123456789"
                      type="tel"
                      {...field}
                      disabled={isLoading}
                      inputMode="numeric"
                      onChange={(e) => {
                        const numbersOnly = e.target.value.replace(/\D/g, "");
                        field.onChange(numbersOnly);
                      }}
                      pattern="[0-9]*"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <Calendar24 onDateTimeChange={handleDateTimeChange} />
              {(form.formState.errors.visitDate ||
                form.formState.errors.startTime) && (
                <p className="text-destructive text-sm">
                  Please select a visit date and time
                </p>
              )}
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
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Acme Inc."
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
              name="invitedBy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Invited By
                    <span className="align-top text-red-500 text-xs">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Doe"
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
                    <span className="align-top text-red-500 text-xs">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Co-working @ 500 Social House"
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
              name="agreeToGuidelines"
              render={({ field }) => {
                const hasAgreed = field.value;

                return (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={hasAgreed}
                        disabled={isLoading}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="font-normal text-sm">
                        <Link
                          className="text-blue-600 underline hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                          href={ROUTES.GUIDE}
                          target="_blank"
                        >
                          I agree to abide by the community and housekeeping
                          guidelines
                        </Link>
                        <span className="align-top text-red-500 text-xs">
                          *
                        </span>
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                );
              }}
            />

            <Button
              className="w-full font-mono"
              disabled={isLoading || !form.formState.isValid}
              type="submit"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  registering...
                </>
              ) : (
                "register"
              )}
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
}
