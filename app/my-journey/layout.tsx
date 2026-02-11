import DashboardLayout from "../dashboard/layout"

export default function MyJourneyLayout({
       children,
}: {
       children: React.ReactNode
}) {
       return <DashboardLayout>{children}</DashboardLayout>
}
