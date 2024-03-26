export function updateSubcategoryOptions() {
    console.log("updateSubcategoryOptions function called");  // Add this line for debugging
    
    var categoryDropdown = document.getElementById('category');
    var subcategoryDropdown = document.getElementById('subcategory');

    // Clear existing options in subcategory dropdown
    subcategoryDropdown.innerHTML = '';

    // Get the selected category
    var selectedCategory = categoryDropdown.value;

    // Define subcategory options based on the selected category
    let subcategoryOptions = []; // Change const to let here
    if (selectedCategory === 'income') {
        subcategoryOptions = ['Salary', 'Bonus', 'Other'];
    } else if (selectedCategory === 'expense') {
        subcategoryOptions = ['Rent', 'Utilities', 'Groceries', 'Other'];
    } else if (selectedCategory === 'savings') {
        subcategoryOptions = ['Insert', 'Take out'];
    }

    // Populate subcategory dropdown with options
    subcategoryOptions.forEach(function (option) {
        var optionElement = document.createElement('option');
        optionElement.value = option.toLowerCase();
        optionElement.textContent = option;
        subcategoryDropdown.appendChild(optionElement);
    });
}
