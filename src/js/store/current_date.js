let today = new Date();
function curMouth (num) {
   if (num < 10)
      return '0' + (num + 1);
   return num + 1; 
}
let dateValue = today.getFullYear() + '-' + curMouth(today.getMonth()) + '-' + today.getDate();

export default dateValue;

