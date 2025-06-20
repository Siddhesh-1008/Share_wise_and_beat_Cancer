export function calcExpense(arr) {
  let result = new Map();
  let sortedArr = [...arr]; // Convert the array to an iterable object
  
  sortedArr = sortedArr.sort((a, b) => a.amount - b.amount);

  for (let i = sortedArr.length - 1; i >= 0; i--) {
    const amount = sortedArr[i].amount / sortedArr.length;
    for (let j = 0; j < i; j++) {
      const amount1 = sortedArr[j].amount / sortedArr.length;
      if (amount - amount1 > 0) {
        let transactions = null;
        if (result.has(sortedArr[j].name)) {
          transactions = result.get(sortedArr[j].name);
        } else {
          transactions = [];
        }
        transactions.push({
          name: sortedArr[i].name,
          amount: amount - amount1,
        });
        result.set(sortedArr[j].name, transactions);
      }
    }
  }
  return result;
}
