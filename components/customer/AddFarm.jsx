async function saveFarm(){

  try{

    setLoading(true);


    const { data:userData, error:userError } =
      await supabase.auth.getUser();


    if(userError)
      throw userError;


    const user = userData.user; alert(
  "USER ID: " + user?.id
);


    if(!user){

      alert("Login required");

      return;

    }



    const { data:khet, error } = await supabase

    .from("khets")

    .insert({

      user_id:user.id,

      name:farm.name,

      village:farm.village,

      farm_address:farm.farm_address,

      acres:Number(farm.acres),

      state:farm.state,

      district:farm.district,

      taluka:farm.taluka

    })

    .select("*");





    console.log(
      "INSERT RESULT:",
      khet,
      error
    );





    if(error)
      throw error;





    alert(
      "✅ Farm Added Successfully\nID: "
      +
      khet[0].id
    );





    for(
      const file of documents
    ){

      await uploadDocument(

        file,

        khet[0].id,

        user.id

      );

    }





    if(onSaved){

      onSaved();

    }



  }
  catch(err){

    alert(err.message);

    console.log(err);

  }
  finally{

    setLoading(false);

  }

}
