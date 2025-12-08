import { Layout } from '@/components/layout/Layout';
import { HeroSection } from '@/components/home/HeroSection';
import { FeaturedEvents } from '@/components/home/FeaturedEvents';
import { LatestSermon } from '@/components/home/LatestSermon';
import { LatestBlogPosts } from '@/components/home/LatestBlogPosts';
import { CTASection } from '@/components/home/CTASection';

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <FeaturedEvents />
      <LatestSermon />
      <LatestBlogPosts />
      <CTASection />
    </Layout>
  );
};

export default Index;