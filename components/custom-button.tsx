"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { usePromptStore } from "@/lib/prompt-store";

const FormSchema = z.object({
  message: z.string().min(2, {
    message: "警告：如此简短的话语，怎能承载时代的沉重？",
  }),
});

export function InputForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      message: "",
    },
  });

  const setPrompt = usePromptStore((state) => state.setPrompt);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    setPrompt(data.message);
    toast.success(
      `你那苦涩的文字「${data.message}」已被铭记，如同时代的叹息。`
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>留言</FormLabel>
              <FormControl>
                <Input placeholder="请输入你的话语" {...field} />
              </FormControl>
              <FormDescription>用鲁迅风格重写你的语句</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">提交</Button>
      </form>
    </Form>
  );
}
