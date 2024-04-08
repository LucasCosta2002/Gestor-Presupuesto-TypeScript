import { categories } from "../data/categories";
import DatePicker from 'react-date-picker'
import 'react-calendar/dist/Calendar.css';
import 'react-date-picker/dist/DatePicker.css';
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import type { DraftExpense, Value } from "../types";
import ErrorMessage from "./ErrorMessage";
import { useBudget } from "../hooks/useBudget";

export default function ExpenseForm() {

    const [expense, setExpense] = useState<DraftExpense>({
        expenseName: '',
        amount: 0,
        category: '',
        date: new Date()
    });

    const [ error, setError ] = useState('');
    const [ previousAmount, setPreviousAmount ] = useState(0);
    const { state, dispatch, remainingBudget } = useBudget();

    //ejecuta cuando swipeamos el gasto, buscamos el gasto en expenses y lo seteamos en el state del formulario
    useEffect(() => {
        if(state.editingId){
            const editingExpense = state.expenses.filter( currentExpense => currentExpense.id === state.editingId)[0];
            setExpense(editingExpense);
            setPreviousAmount(editingExpense.amount)
        }
    }, [state.editingId])
    

    const handleChange = ( e : ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement> ) => {
        const { name, value } = e.target;

        //detectar cuando escribimos en amount
        const isAmountField = ['amount'].includes(name);

        setExpense({
            ...expense,
            [name] : isAmountField ? +value : value
        })
    }

    const handleChangeDate = (value : Value )=> {
        setExpense({
            ...expense,
            date: value
        })   
    }

    const handleSubmit = (e : FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        //comprobar que el state expense no este vacio
        if(Object.values(expense).includes('')) {
            setError('Todos los campos son obligatorios');
            return
        }
       
        //comprobar que no pase el presupuesto
        if( (expense.amount - previousAmount) > remainingBudget ) {
            setError('Tu presupuesto es insuficiente');
            return
        }

        //agregar un nuevo gasto o actualizar el gasto
        if (state.editingId) {
                dispatch({type: "update-expense", payload: {expense: {id: state.editingId, ...expense}}});
        } else {
            dispatch({type: "add-expense", payload: {expense}});
        }

        //resetear el state
        setExpense({
            expenseName: '',
            amount: 0,
            category: '',
            date: new Date()
        })
        setPreviousAmount(0)
    }

    return (
        <form className="space-y-5" onSubmit={handleSubmit}>
            <legend
                className="uppercase text-center text-2xl font-black border-b-4 py-2 border-blue-500 "
            >{state.editingId ? "Guardar Cambios" : "Nuevo Gasto"}
            </legend>

            {error && <ErrorMessage>{error}</ErrorMessage> }

            <div className="flex flex-col gap-2">
                <label htmlFor="expenseName" className="text-xl">
                    Nombre Gasto
                </label>
                <input 
                    type="text"
                    id="expenseName" 
                    placeholder="Añade el nombre del gasto"
                    className="bg-slate-100 p-2"
                    name="expenseName"
                    value={expense.expenseName}
                    onChange={handleChange}
                />
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="amount" className="text-xl">
                    Cantidad
                </label>
                <input 
                    type="number"
                    id="amount" 
                    placeholder="Añade la cantidad"
                    className="bg-slate-100 p-2"
                    name="amount"
                    value={expense.amount}
                    onChange={handleChange}
                />
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="category" className="text-xl">
                    Categoria
                </label>
                <select 
                    id="category" 
                    className="bg-slate-100 p-2"
                    name="category"   
                    value={expense.category}
                    onChange={handleChange}
                >
                    <option value=""> -- Seleccione --</option>
                    {categories.map(category => (
                        <option 
                            value={category.id}
                            key={category.id}   
                        >{category.name}</option>
                    ))}
                </select>
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="amount" className="text-xl">
                    Fecha
                </label>
                <DatePicker 
                    className="bg-slate-100 p-2 border-0"
                    value={expense.date}
                    onChange={handleChangeDate}
                />
            </div>
            
            <input 
                type="submit"
                value={state.editingId ? "Guardar Cambios" : "Registrar Gasto"}
                className="bg-blue-600 cursor-pointer w-full p-2 text-white uppercase font-bold rounded-lg hover:bg-blue-700 transition-colors"
            />
        </form>
    )
}