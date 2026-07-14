import React from "react";


export default function DateSelection({

  date,
  setDate,
  note,
  setNote,
  next,
  back,

}) {



const minDate = new Date();

minDate.setDate(
  minDate.getDate()+1
);



function handleNext(){


if(!date){

alert(
"Booking date select kare"
);

return;

}


next();


}





return(

<div className="min-h-screen bg-green-50 p-5">


<div className="max-w-xl mx-auto bg-white rounded-3xl shadow-xl p-6">



<h1 className="text-2xl font-bold text-green-700">

📅 Select Service Date

</h1>



<p className="text-gray-500 mt-2">

Choose when you need KisanSetu service

</p>







<div className="mt-6 bg-green-50 rounded-2xl p-5">


<label className="font-bold">

🚜 Service Date

</label>




<input

type="date"

min={
minDate
.toISOString()
.split("T")[0]
}


value={date}


onChange={(e)=>
setDate(e.target.value)
}


className="w-full mt-3 p-4 rounded-xl border"

/>



</div>








<div className="mt-6">


<label className="font-bold">

📝 Driver Message

</label>



<textarea

rows="4"

value={note}

onChange={(e)=>
setNote(e.target.value)
}


placeholder="Driver ke liye koi information..."

className="w-full mt-3 p-4 rounded-xl border"

/>



</div>








<div className="flex gap-3 mt-6">



<button

onClick={back}

className="flex-1 bg-gray-200 p-4 rounded-xl font-bold"

>

← Back

</button>





<button

onClick={handleNext}

className={`flex-1 p-4 rounded-xl font-bold text-white ${
date
?
"bg-green-600"
:
"bg-gray-400"
}`}

disabled={!date}

>

Continue →

</button>




</div>





</div>


</div>


);


}
