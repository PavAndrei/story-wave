import { ROUTES } from "@/shared/model/routes";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/shared/ui/kit/carousel";
import {
  Bell,
  Eye,
  FolderOpen,
  Folders,
  FolderSearch,
  Heart,
  Lock,
  MessagesSquare,
  NotebookPen,
  PenLine,
  Settings,
  StickyNote,
  User,
  UserLock,
  Users,
} from "lucide-react";
import type { JSX } from "react";
import { Link } from "react-router-dom";

type FeatureContent = {
  icon: JSX.Element;
  subtitle: string;
  text: string;
};

type Feature = {
  title: string;
  link?: string;
  features: FeatureContent[];
};

const FEATURE_LIST: Feature[] = [
  {
    title: "Content Creation",
    link: ROUTES.CREATE_BLOG,
    features: [
      {
        icon: <NotebookPen />,
        subtitle: "Advanced Markdown Editor",
        text: "Live preview, autosave, toolbar, and export to Markdown, HTML, and PDF — everything you need for long-form writing.",
      },
      {
        icon: <FolderOpen />,
        subtitle: "Draft & Publish Flow",
        text: "Create drafts, edit published posts, and manage content lifecycle with full control.",
      },
    ],
  },
  {
    title: "Content Discovery",
    link: ROUTES.BLOGS,
    features: [
      {
        icon: <Folders />,
        subtitle: "Blog Feed & Discovery",
        text: "Browse blogs with pagination, filters, and a discovery column for quick navigation.",
      },
      {
        icon: <FolderSearch />,
        subtitle: "Search & Filters",
        text: "Find content by title, categories, or author with flexible filtering options.",
      },
      {
        icon: <StickyNote />,
        subtitle: "Blog Pages",
        text: "Dedicated pages for each post with views, likes, favorites, and comments.",
      },
    ],
  },
  {
    title: "Community & Engagement",
    features: [
      {
        icon: <Heart />,
        subtitle: "Likes & Favorites",
        text: "Engage with content through likes and favorites, with optimistic UI updates.",
      },
      {
        icon: <MessagesSquare />,
        subtitle: "Comments & Replies",
        text: "Nested comments with editing, deleting, and keyboard shortcuts support.",
      },
      {
        icon: <Eye />,
        subtitle: "View Tracking",
        text: "Track post popularity through view counters.",
      },
    ],
  },
  {
    title: "User Profiles",
    features: [
      {
        icon: <User />,
        subtitle: "User Profiles",
        text: "Public profile pages with authored blogs, comments, and activity.",
      },
      {
        icon: <Settings />,
        subtitle: "Profile Management",
        text: "Edit personal information, avatar, and account details.",
      },
      {
        icon: <PenLine />,
        subtitle: "Author Pages",
        text: "Explore all posts written by a specific author with filters and pagination.",
      },
    ],
  },
  {
    title: "Authentication & Access",
    link: ROUTES.REGISTER,
    features: [
      {
        icon: <Lock />,
        subtitle: "Authentication & Authorization",
        text: "Secure login and registration with protected routes and user sessions.",
      },
    ],
  },
  {
    title: "Coming Soon (Roadmap)",
    features: [
      {
        icon: <Bell />,
        subtitle: "Notifications",
        text: "Stay updated with in-app notifications for likes, comments, and replies.",
      },
      {
        icon: <Users />,
        subtitle: "Subscriptions",
        text: "Follow other authors and keep track of their new posts.",
      },
      {
        icon: <UserLock />,
        subtitle: "Privacy & Notification Settings",
        text: "Control who can interact with you and how you receive notifications, including email alerts.",
      },
    ],
  },
];

const FeatureItem = (item: Feature) => {
  return (
    <div className="max-w-[400px] flex flex-col gap-2 items-center p-2 rounded-md border border-slate-700 bg-slate-200 min-h-full cursor-grab select-none h-full">
      <h3 className="text-center font-semibold text-xl">{item.title}</h3>
      <ul className="flex flex-col gap-2 h-full">
        {item.features.map((feature, i) => (
          <li key={i} className="flex flex-col gap-2 items-center text-center">
            {feature.icon}
            <h4 className="text-lg font-medium">{feature.subtitle}</h4>
            <p className="text-sm">{feature.text}</p>
          </li>
        ))}
        {item.link && (
          <Link
            to={item.link || ""}
            className="mt-auto mb-0 text-sm opacity-90 [&_a]:text-base [&_a]:underline text-cyan-600 transition-colors duration-200 ease-in hover:underline text-center"
          >
            Try Right Now
          </Link>
        )}
      </ul>
    </div>
  );
};

export const FeaturesSection = () => {
  return (
    <section className="flex flex-col gap-10 max-w-[1460px] w-full mx-auto my-0 px-2.5">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold">
          Everything you need to write, publish, and engage
        </h2>
        <p>
          A full-featured blogging platform built with scalability and user
          experience in mind.
        </p>
      </div>

      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-[80%] self-center"
      >
        <CarouselContent>
          {FEATURE_LIST.map((feature) => (
            <CarouselItem className="basis-1/3" key={feature.title}>
              <FeatureItem {...feature} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute top-1/2 -left-12 cursor-pointer active:scale-95 border border-slate-700 hover:bg-slate-200 bg-slate-50" />
        <CarouselNext className="absolute top-1/2 -right-5- cursor-pointer active:scale-95 border border-slate-700 hover:bg-slate-200 bg-slate-50" />
      </Carousel>
    </section>
  );
};
