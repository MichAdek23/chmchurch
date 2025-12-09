import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import Events from "./pages/Events";
import Sermons from "./pages/Sermons";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Give from "./pages/Give";
import Contact from "./pages/Contact";
import PrayerRequest from "./pages/PrayerRequest";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminSettings from "./pages/admin/Settings";
import AdminEvents from "./pages/admin/Events";
import AdminSermons from "./pages/admin/Sermons";
import AdminBlogPosts from "./pages/admin/BlogPosts";
import AdminContacts from "./pages/admin/Contacts";
import AdminPrayerRequests from "./pages/admin/PrayerRequests";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/events" element={<Events />} />
            <Route path="/sermons" element={<Sermons />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/give" element={<Give />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/prayer-request" element={<PrayerRequest />} />
            <Route path="/auth" element={<Auth />} />
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="/admin/events" element={<AdminEvents />} />
            <Route path="/admin/sermons" element={<AdminSermons />} />
            <Route path="/admin/blog" element={<AdminBlogPosts />} />
            <Route path="/admin/contacts" element={<AdminContacts />} />
            <Route path="/admin/prayers" element={<AdminPrayerRequests />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
