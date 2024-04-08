import { useMemo } from "react";
import { useBudget } from "../hooks/useBudget"
import ExpenseDetail from "./ExpenseDetail";

export default function ExpenseList() {

    const { state } = useBudget(); 

    const fitleredExpenses = state.currentCategory ? state.expenses.filter( expense => expense.category === state.currentCategory ) : state.expenses;

    const isEmpty = useMemo( () => fitleredExpenses.length === 0, [fitleredExpenses]);

    return (
        <div className="mt-10 bg-white shadow-lg rounded-lg p-5">
            {isEmpty ? 
                <p className="text-gray-600 text-2xl font-bold">No hay Gastos</p>
            : (
                <>
                    <p className="text-gray-600 text-2xl font-bold my-5">Listado de Gastos</p>                
                    {fitleredExpenses.map( expense => (
                        <ExpenseDetail 
                            key={expense.id}
                            expense={expense}
                        />
                    ))}
                </>
            )}
        </div>

    )
}

