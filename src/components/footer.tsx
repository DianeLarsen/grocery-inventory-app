import Link from "next/link";
import { JSX, SVGProps } from "react";
import { MdOutlinePrivacyTip } from "react-icons/md";
import { AiOutlineUserDelete } from "react-icons/ai";
import { SiClerk } from "react-icons/si";

const navigation = [
  {
    name: "Facebook",
    href: "https://www.facebook.com/groups/havensheroes",
    icon: (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => (
      <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path
          fillRule="evenodd"
          d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
          clipRule="evenodd"
        />
      </svg>
    ),
    title: "Facebook Group"
  },
 
  {
    name: "Privacy",
    href: "https://www.havens-heroes.com/index.html",
    icon: (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => (
      <MdOutlinePrivacyTip />
    ),
    title: "Privacy Info"
  },
  {
    name: "Data Deletion",
    href: "https://www.havens-heroes.com/data-deletion",
    icon: (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => (
      <AiOutlineUserDelete />
    ),
    title: "How to delete account"
  },
  {
    name: "Privacy Clerk",
    href: "https://www.havens-heroes.com/privacy",
    icon: (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => (
      <SiClerk />
    ),
    title: "Clerk Privacy"
  },
];

export default function Footer() {
  return (
    <footer className="py-8">
      <div className="container max-w-3xl">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center space-x-6 md:order-2">
            {navigation &&
              navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-muted-foreground hover:text-foreground"
                  title={item.title}
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon aria-hidden="true" className="h-5 w-5" />
                </Link>
              ))}
          </div>
          <div className="mt-8 md:order-1 md:mt-0">
            <p className="text-center text-xs leading-5 text-muted-foreground">
              &copy; {new Date().getFullYear()} Panda Love LLC. All rights
              reserved.
            </p>
          </div>
        </div>
      </div>

    </footer>
  );
}
