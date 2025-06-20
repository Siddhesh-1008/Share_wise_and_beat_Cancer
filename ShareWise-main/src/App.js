import './App.css';
import { useState } from "react";
import { calcExpense } from './expense';
import db from "./FbConfig.js";

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
  
  const submit = async (event) => {
    event.preventDefault();
    setIsCalculated(true);
  
    for (const transaction of userTransaction) {
      const { name, amount } = transaction;
  
      const res = await fetch('https://reactfirebasewebsite-675ef-default-rtdb.firebaseio.com/userDataRecords.json', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          amount,
        }),
      });
      // Handle the response if needed
    }
  };
  

const addMore= ()=>
  {
    const newTransaction ={name: '',amount: ''};
    setUserTransaction([...userTransaction,newTransaction]) /*HERE SATATE IS GETTING UPDATED*/ 
    setIsCalculated(false);
  }
  const removeTransaction = async (index) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this transaction?');
    if (confirmDelete) {
      const data = [...userTransaction];
      data.splice(index, 1);
      setUserTransaction(data);
      setIsCalculated(false);
  
      // Delete the transaction from the database
      try {
        const res = await fetch(`https://reactfirebasewebsite-675ef-default-rtdb.firebaseio.com/userDataRecords/${index}.json`, {
          method: "DELETE",
        });
        // Handle the response if needed
      } catch (error) {
        console.error('Error deleting transaction:', error);
      }
    }
  };
  
 
  const handleFormChange = (event, index) => {
    const { name, value } = event.target;
    const updatedUserTransaction = [...userTransaction]; // Create a copy of the userTransaction array
    updatedUserTransaction[index] = {
      ...updatedUserTransaction[index], // Copy the existing transaction object
      [name]: value, // Update the specific property (name or amount)
    };
    if (name === 'name' && value.trim().length < 2) {
      window.alert('Name should be at least 2 characters long');
      updatedUserTransaction[index].name = ''; // Clear the name field
    } else if (name === 'amount' && (!value || isNaN(Number(value)) || Number(value) < 0)) {
      window.alert('Amount should be a positive number');
      updatedUserTransaction[index].amount = ''; // Clear the amount field
    } else {
      setUserTransaction(updatedUserTransaction);
      setIsCalculated(false);
    }
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
    setUserTransaction(updatedUserTransaction);
    setIsCalculated(false);
  };
  

  const isFormValid = () =>
  !userTransaction.some((trans) => !trans.name || !trans.amount);


  const calculationResult = [];

calcExpense(userTransaction).forEach((value, key) => {
  calculationResult.push({
    name: key,
    transactions: value,
  });
});

const saveCalculationResult = async () => {
  const res = await fetch('https://reactfirebasewebsite-675ef-default-rtdb.firebaseio.com/calculationResult.json', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(calculationResult),
  });
  // Handle the response if needed
};

saveCalculationResult();

    
  

  


  
  
  
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
