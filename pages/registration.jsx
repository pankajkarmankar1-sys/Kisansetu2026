import { useRouter } from "next/router";
import Registration from "../components/customer/Registration";

export default function RegistrationPage() {

  const router = useRouter();

  const phone =
    router.query.phone || "";


  function handleDone() {

    router.replace("/documents");

  }


  function back() {

    router.replace("/login");

  }


  return (

    <Registration

      phone={phone}

      onDone={handleDone}

      back={back}

    />

  );

}
