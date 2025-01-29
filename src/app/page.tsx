import Link from "next/link";

export default function Home() {
  return (
    <>
      <h1>Home</h1>
      <p>Welcome to the Home page</p>
      <li>
        <Link href={"/blog"}>Hello</Link>
      </li>
    </>
  );
}
