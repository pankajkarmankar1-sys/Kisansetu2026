// hooks/useDriver.js

import { useEffect, useState } from "react";
import {
  saveDriver,
  getDriver,
} from "../services/driverService";


export default function useDriver() {

  const [driver, setDriver] = useState(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);



  async function addDriver(data) {

    try {

      setLoading(true);
      setError(null);


      await saveDriver(data);


      setDriver(data);


      return {
        success:true,
      };


    } catch(err) {

      setError(
        err.message
      );

      throw err;


    } finally {

      setLoading(false);

    }

  }





  async function loadDriver(phone) {

    try {

      setLoading(true);


      const data =
        await getDriver(phone);


      setDriver(data);


      return data;


    } catch(err) {

      setError(
        err.message
      );

      throw err;


    } finally {

      setLoading(false);

    }

  }





  return {

    driver,

    loading,

    error,

    addDriver,

    loadDriver,

  };

}
