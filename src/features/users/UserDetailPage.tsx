import { useParams } from "react-router-dom";
import UserProfileCard from "./components/UserProfileCard";

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <UserProfileCard userId={id} />
    </div>
  );
}
