import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "../_navigation/sidebar"
import "../globals.css"
import ReactQueryProvider from "../_components/QueryClientProvider"
import { Toaster } from "@/components/ui/sonner"
 
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html>
        <body>
          <SidebarProvider>
          <AppSidebar />
            <main className="flex-1 w-full overflow-auto">
              <ReactQueryProvider>
                {children}
              </ReactQueryProvider>
              <Toaster/>
            </main>
          </SidebarProvider>
        </body>
    </html>
  )
}