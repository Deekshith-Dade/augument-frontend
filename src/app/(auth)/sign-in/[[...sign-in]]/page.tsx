import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="contianer mx-auto flex flex-col lg:flex-row justify-around items-center h-screen">
      <div className="text-2xl  font-bold mb-4 ">
        <p className="text-center px-8">
          Please Continue to Sign-In Here For Augment
        </p>
      </div>

      <div className="">
        <SignIn />
      </div>
    </div>
  );
}
