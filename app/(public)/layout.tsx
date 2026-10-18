import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MotionProvider from "@/components/ui/MotionProvider";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MotionProvider>
      <div className="overflow-x-hidden">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </div>
    </MotionProvider>
  );
}
