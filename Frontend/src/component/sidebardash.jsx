import { AppSidebar } from "../components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

import React from 'react'

export function SideNav() {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarTrigger />
        </SidebarProvider>
    )
}
