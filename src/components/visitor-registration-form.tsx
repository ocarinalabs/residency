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
import { toast } from "sonner";
import { Calendar24 } from "@/components/ui/calendar-date";
// import { RoomSelector } from "./room-selector";

// DEBUG FLAG: Set to true to disable automatic transitions and show debugging controls
// You can also enable debug mode by adding ?debug=true to the URL
const DEBUG =
  typeof window !== "undefined" &&
  (new URLSearchParams(window.location.search).get("debug") === "true" ||
    false);

const formSchema = z.object({
  fullName: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  icPassport: z.string().min(6, {
    message: "IC/Passport Number must be at least 6 characters.",
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
  company: z.string().optional(),
  invitedBy: z.string().min(2, {
    message: "Please provide the name of the person who invited you.",
  }),
  selectedRoom: z.string().optional(),
  bookingDuration: z.string().optional(),
});

export function VisitorRegistrationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

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
      reasonToVisit: "Co-working @ 500 Social House",
      company: "",
      invitedBy: "",
      selectedRoom: "",
      bookingDuration: "2",
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
        form.setValue("reasonToVisit", "Co-working @ 500 Social House");
        form.setValue("company", parsed.company || "");
        form.setValue("invitedBy", parsed.invitedBy || "");
        if (parsed.selectedRoom) {
          form.setValue("selectedRoom", parsed.selectedRoom);
        }
        if (parsed.bookingDuration) {
          form.setValue("bookingDuration", parsed.bookingDuration);
        }
        // Silent auto-fill, no toast
      } catch (e) {
        console.error("Failed to parse local storage data", e);
      }
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
        company: values.company,
        invitedBy: values.invitedBy,
        selectedRoom: values.selectedRoom,
        bookingDuration: values.bookingDuration,
      })
    );
    console.log("💾 Saved to localStorage");

    try {
      // Format dates for API
      const visitStart = new Date(values.visitDate + "T" + values.startTime)
        .toISOString()
        .replace(".000Z", "Z");
      const visitEnd = new Date(values.visitDate + "T23:59")
        .toISOString()
        .replace(".000Z", "Z");

      const payload = {
        name: values.fullName,
        email: values.email,
        userId: null,
        phone: values.phoneNumber,
        keytoken: "fK2FBZ9WWr4lpa3U2dq2",
        visitStart: visitStart,
        visitEnd: visitEnd,
        vehicleNumber: values.vehicleNumber || null,
        reason: values.invitedBy
          ? `${values.reasonToVisit}_${values.invitedBy}`
          : values.reasonToVisit,
        companyName: values.company || "500 Social House",
        inviterEmail: null,
        liftGroupId: null,
        userPhoto: null,
        isRepeatVisit: false,
      };

      console.log("🎯 Calling proxy API with payload:", payload);

      // Call the proxy API directly
      const response = await fetch("/api/nuveq-proxy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();
      console.log("📨 Proxy response:", responseData);

      if (responseData.success) {
        console.log("✅ Registration successful!");
        toast.success(
          "Registration successful! Check your email for confirmation."
        );
        setIsLoading(false);
        setIsSubmitted(true);
      } else {
        console.error("❌ Registration failed:", responseData);

        // Parse error message
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
    } catch (error) {
      console.error("❌ Network error:", error);
      toast.error("Network error. Please check your connection and try again.");
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-card rounded-none border">
      {isSubmitted ? (
        // Success state
        <div className="flex flex-col items-center justify-center py-8 space-y-4">
          <CheckCircle className="h-16 w-16 text-green-500" />
          <h2 className="text-2xl font-bold text-center">
            Registration Complete!
          </h2>
          <p className="text-sm text-muted-foreground text-center px-4">
            Check your email for confirmation.
          </p>
        </div>
      ) : (
        // Form state
        <>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-center">Visitor Access</h2>
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
                      IC/Passport Number
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
                {(form.formState.errors.visitDate ||
                  form.formState.errors.startTime) && (
                  <p className="text-sm text-destructive">
                    Please select a visit date and time
                  </p>
                )}
              </div>

              {/* Room Selection Section - Disabled for now */}
              {/* <RoomSelector
                selectedRoomId={form.watch("selectedRoom")}
                selectedDuration={form.watch("bookingDuration")}
                onRoomSelect={(roomId) => form.setValue("selectedRoom", roomId)}
                onDurationSelect={(duration) =>
                  form.setValue("bookingDuration", duration)
                }
              /> */}

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
                      <span className="text-red-500 align-top text-xs">*</span>
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
                      <span className="text-red-500 align-top text-xs">*</span>
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

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Registering...
                  </>
                ) : (
                  "Register"
                )}
              </Button>
            </form>
          </Form>
        </>
      )}
    </div>
  );
}
