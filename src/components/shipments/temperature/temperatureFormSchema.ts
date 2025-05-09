
import * as z from "zod";

export const temperatureFormSchema = z.object({
  temperature: z.coerce
    .number({
      required_error: "Temperature is required.",
      invalid_type_error: "Temperature must be a number",
    })
    .min(-50, { message: "Temperature must be at least -50°C" })
    .max(100, { message: "Temperature must be below 100°C" }),
  device_id: z.string().optional(),
  location: z.string().optional(),
});

export type TemperatureFormValues = z.infer<typeof temperatureFormSchema>;
