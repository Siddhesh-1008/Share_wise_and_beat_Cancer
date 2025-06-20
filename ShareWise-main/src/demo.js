import './App.css';
import { useState } from "react";
import { calcExpense } from './expense';

function App() {
{
  /*state particular store kartahae name and amount refresh nhi karta agar apan ne state set kiya hoga tho */ }
  const [userTransaction,setUserTransaction]=useState([
    {
    name: '',
     amount: ''
    },
  ])

  const[isCalculated,setIsCalculated] = useState(false);
  
  const submit = async (event) => 
  {
    event.preventDefault();
    setIsCalculated(true);
    const{ name,amount}=userTransaction;
    const res =fetch('https://reactfirebasewebsite-675ef-default-rtdb.firebaseio.com/userDataRecords.json',
    {
    method:"POST",
    headers:
    {
        "Content-Type":"application/json",
    },
    body:JSON.stringify({
        name,
        amount,  
    }),
}
    );
}

const addMore= ()=>
  {
    const newTransaction ={name: '',amount: ''};
    setUserTransaction([...userTransaction,newTransaction]) /*HERE SATATE IS GETTING UPDATED*/ 
    setIsCalculated(false);
  }

  const removeTransaction =(index)=>{
     console.log(index);
    const data= [...userTransaction];
    data.splice(index,1);
    setUserTransaction(data);
    setIsCalculated(false);

      
  }
  let name,amount;
  const handleFormChange =(event,index)=>
  {
    name=event.target.name;
    value=event.target.value;
    /*console.log(event.target.value,index); /* isme baas index ke saath name aur amount dikhega means 0:raju 0:222*/
    /*console.log(event.target.name);       /*yae 0:raju name AND 0:222 amount dikhega*/ 
    /*const data=[...userTransaction,[name]: value];*/     /*pahila data mae state ko lo */
    setIsCalculated(false);
    if(event.target.name === 'name')
   {
    const existingUser=userTransaction.find
    (trans=>trans.name.toLowerCase() === event.target.value.toLowerCase())
 
    if(existingUser)     /*IF existingUser is true then it will display that error else*/
   {
    alert("PLEASE SELECT ANOTHER RNAME");
    event.target.value=''
    return;
   }
  }
   
data[index][event.target.name]=event.target.value;    /*yae dikhega iss prakar 0 name raju  0 amount 222 */
setUserTransaction({...userTransaction,[name]: value});
console.log(userTransaction);

   
  }

  const isFormValid = () =>
  !userTransaction.some((trans) => !trans.name || !trans.amount);


  const calculationResult =[];
calcExpense(userTransaction).forEach((value,key)=>
     calculationResult.push(
     { name: key,
      transactions:value
    }
    ));
    console.log(calculationResult);
    
  

  


  
  
  
  return (
   <div className="app-container">
    <div className="app-row">
      <h3 className="title">
        EXPENSE CALCULATOR
      </h3>
      <form method="POST" onSubmit={submit}>
     
      {/*FORM CONTAINER STARTS*/}
     <div className="form-container">
    
     {/*EXPENSE_FORM CONTAINER STARTS  index is ADD TO IDENTIIFY EACH DIFERENT INPUT AND AMOUNT  ...IS USED FOR ARRAY DATA STRUCTURE IT SPILLS THE DATA*/}
   {userTransaction.map((eachTrans,index)=>
   (
    <div className="expense-form"key={index}>
      <div className="app-form-controls" >
        <label>Name</label>
        
        <input  
        type='text'  
        name='name' 
        value={userTransaction.name}
        onChange={(event)=> handleFormChange(event,index)}
            
        />
      </div> 
      <div className="app-form-controls" >
        <label>Amount</label>
       <input 
        type='text'
         name='amount'
         value={userTransaction.amount}
         onChange={(event)=> handleFormChange(event,index)}
         
         />
      </div> 
      <div className="form-btn-remove">
        <button 
        type="button" 
        onClick={()=>removeTransaction(index)}>
        X
        </button>
      </div>
      </div>

   ))}
    <div className="btn-controls">
    <button type="button" 
    className='add-btn' onClick={addMore}>ADD
      </button>
          
          <button 
          type="submit"
           className='calculate-btn' 
           onClick={submit}
           disabled={userTransaction.length<2 || !isFormValid() }>
           CALCULATE
           </button>
          </div>
       
      
      </div>
        
      
      </form>
      <div className='report'>
      {userTransaction.length>1 && isCalculated && calculationResult.length ? (
        <table className='table table-bordered table-dark '>
        <thead>
        <tr>
          <th>Payer</th>
          <th>Transaction (Receiver =&gt; Amount)</th>
          
          </tr>
        </thead>
        <tbody>
          {calculationResult.map((eachRes,i) =>(
            <tr>
              <td>{eachRes.name}</td>
              <td>
                {eachRes.transactions.map((trans, index) =>
                (
                  <div className='receiver-amount' key={index}>
                  <div>{trans.name}</div>
                  <div>{trans.amount.toFixed(2)}</div>
              
                 </div>

                ))}
              </td>
            </tr>
          ) )}
        </tbody>
      
      </table>
      ) : (
        userTransaction.length > 1 && isCalculated &&
       ( <div>
          <h3>NO ONE SPENT EXTRA AMOUNT</h3>
        </div>
      )
      )}

     
   </div>
      </div>
   </div>

  );
}

export default App;