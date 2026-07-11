async function saveFarm() {

  try {

    setLoading(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) throw userError;

    if (!user) {
      alert("Login required");
      return;
    }

    const { data: khet, error } = await supabase
      .from("khets")
      .insert([
        {
          user_id: user.id,
          name: farm.name,
          village: farm.village,
          farm_address: farm.farm_address,
          acres: Number(farm.acres),
          state: farm.state,
          district: farm.district,
          taluka: farm.taluka,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    for (const file of documents) {
      await uploadDocument(
        file,
        khet.id,
        user.id
      );
    }

    alert("✅ Farm Added Successfully");

    if (onSaved) {
      onSaved();
    }

  } catch (err) {

    console.error(err);
    alert(err.message);

  } finally {

    setLoading(false);

  }

}
