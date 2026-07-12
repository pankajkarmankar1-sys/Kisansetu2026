import { useRouter } from "next/router";

export default function AdminLogin() {

  const router = useRouter();

  return (
    <div style={{ padding: 20 }}>

      <h2>
        Admin Login
      </h2>

      <button
        onClick={() => {
          router.replace("/login");
        }}
      >
        Continue Login
      </button>

    </div>
  );
}
