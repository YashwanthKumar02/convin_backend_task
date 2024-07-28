function splitEqual(total, participants) {
    const amountPerPerson = total / participants.length;
    return participants.map(participant => ({
      participant,
      amount: amountPerPerson
    }));
}
  
function splitExact(amounts) {
    return amounts.map(({ participant, amount }) => ({
      participant,
      amount
    }));
}
  
function splitPercentage(total, percentages) {
    const totalPercentage = percentages.reduce((sum, { percentage }) => sum + percentage, 0);
    if (totalPercentage !== 100) {
      throw new Error('Percentages must add up to 100%');
    }
  
    return percentages.map(({ participant, percentage }) => ({
      participant,
      amount: (total * percentage) / 100
    }));
}
  
module.exports = {
    splitEqual,
    splitExact,
    splitPercentage
};  