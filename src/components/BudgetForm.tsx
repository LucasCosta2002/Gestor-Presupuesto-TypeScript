import { FormEvent, useMemo, useState } from "react";
import { useBudget } from "../hooks/useBudget";

export default function BudgetForm() {

    const [budget, setBudget] = useState(0);

    const { dispatch } = useBudget();

    const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        setBudget(+e.target.value);
    }

    const isValid = useMemo( () => {return isNaN(budget) || budget <= 0}, [budget]);

    const handleSubmit = (e : FormEvent) => {
        e.preventDefault();
        dispatch({type: "add-budget", payload: {budget}})
    } 

    return (
        <form 
            className="space-y-5"
            onSubmit={handleSubmit}
        >
            <div className="flex flex-col space-y-5">
                <label htmlFor="budget" className="text-4xl text-blue-600 font-bold text-center">
                    Definir Presupuesto
                </label>
                <input 
                    type="number"
                    className="w-full bg-white border border-gray-200 p-2"
                    placeholder="Define tu presupuesto"
                    name="budget"
                    value={budget}    
                    onChange={handleChange}
                />
            </div>
            <input 
                type="submit" 
                value="Definir presupuesto"
                className="disabled:opacity-40 bg-blue-600 hover:bg-blue-700 cursor-pointer w-full p-2 text-white font-black uppercase"
                disabled={isValid}
            />
        </form>
    )
}
