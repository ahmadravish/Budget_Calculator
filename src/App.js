import React,{useState,useEffect} from 'react';
import './App.css';
import ExpenseList from './components/ExpenseList';
import ExpenseForm from './components/ExpenseForm';
import Alert from './components/Alert';
import uuid from 'uuid/v4'

/*const initialExpenses=[
  {id:uuid(),charge:"rent",amount:1600},
  {id:uuid(),charge:"car payment",amount:400},
  {id:uuid(),charge:"credit card bill",amount:1200}
];*/
const initialExpenses=localStorage.getItem('expenses')?JSON.parse(localStorage.getItem('expenses')):[]; 


function App() {

  const [expenses,setExpenses]=useState(initialExpenses);
  const[charge,setCharge]=useState('');
  const[amount,setAmount]=useState('');
  const[alert,setAlert]=useState({show:false});
  const[edit,setEdit]=useState(false);
  const[id,setId]=useState(0);

  useEffect(()=>{
    localStorage.setItem('expenses',JSON.stringify(expenses));
  },[expenses]);

  const handleCharge=e=>{
    setCharge(e.target.value);
    console.log(e.target.value);
  }

  const handleAmount=e=>{
    setAmount(e.target.value)
  }

 const handleAlert=({type,text})=>{
   setAlert({show:true,type,text})
   setTimeout(()=>{
     setAlert({show:false});
   },3000)
 }

  const handleSubmit=e=>{
    e.preventDefault();
    if(charge!=='' && amount>0){
      if(edit){
        let tempExpenses=expenses.map(item=>{
          return item.id===id?{item,charge,amount}:item;
        });
        setExpenses(tempExpenses);
        setEdit(false);
        handleAlert({type:'success',text:'item Edited'})
     }else{
        const singleExpense={id:uuid(),charge,amount};
      setExpenses([...expenses,singleExpense]);
      handleAlert({type:'success',text:'item added'})
      }
      
      setCharge("");
      setAmount("");
       }else{
         handleAlert({type:'danger',text:`charge can't be empty and amount value should be greater than zero`})
      }
  }
 
  const clearItems=()=>{
    setExpenses([]);
    handleAlert({type:'danger',text:'all items deleted'})
  }
  const handleDelete=(id)=>{
    let tempExpenses=expenses.filter(item=>item.id!==id)
    setExpenses(tempExpenses);
    handleAlert({type:'danger',text:'item deleted'})
  }
  const handleEdit=(id)=>{
    let expense=expenses.find(item=>item.id===id);
    let{charge,amount}=expense;
    setCharge(charge);
    setAmount(amount);
    setEdit(true);
    setId(id);
  }
   
  return (
    <>
     {alert.show && <Alert type={alert.type} text={alert.text} />}
     <h1>Budget Calculator</h1>
    <main className="App">
     <ExpenseForm charge={charge} amount={amount} handleAmount={handleAmount} handleCharge={handleCharge} handleSubmit={handleSubmit} edit={edit}/>
     <ExpenseList expenses={expenses} clearItems={clearItems} handleDelete={handleDelete} handleEdit={handleEdit} />
     </main>
     <h1>total spending:
        <span className="total">
       ${expenses.reduce((acc,curr)=>{
         return (acc += parseInt(curr.amount));
       },0)}
        </span>
      </h1>
      <footer class="page-footer font-small special-color-dark pt-4">
  <center className="footer-copyright text-center py-3">© 2020 Developed By:
<a href="https://www.linkedin.com/in/ravish-ahmad-1a9519111" target="_blank">Ravish Ahmad</a>
</center>
</footer>
  </>
   );
}

export default App;
