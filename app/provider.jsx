import React from 'react'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "./_components/AppSidebar"
import { ThemeProvider as NextThemesProvider } from "next-themes"

function Provider({
  children,
  ...props
}) {
  return (
    <NextThemesProvider {...props}
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        >
        <SidebarProvider>
            <AppSidebar />
            <SidebarTrigger />
            <div>{children}</div>
        </SidebarProvider>
    </NextThemesProvider>
  )
}

export default Provider