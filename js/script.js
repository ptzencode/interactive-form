
//****************************//
//  Register for activities
//****************************//

let totalCost = 0;
$('.activities input[type="checkbox"]').on('change',function () {
    let clickedCheckbox = $(this);
    let labelText = clickedCheckbox.closest('label').text();
    let regexDayTime = /([a-zA-Z]+day)\s([0-9]+[a-z]+-[0-9]+[a-z]+)/;
    let match = labelText.match(regexDayTime);

    //disable conflicting activites, only if day-time schedule exists
    if(match) {
        //access the whole match
        let dayTime = match[0];
        $('.activities input[type="checkbox"]').not(':checked').each(function(index,element){
            let elementText = $(element).closest('label').text();
            if(RegExp(dayTime).test(elementText)){
                if(clickedCheckbox.is(":checked")){
                    $(element).prop('disabled',true);
                } else {
                    $(element).prop('disabled',false);
                }
            }
        });
    }

    let regexCost = /\$(\d+)/;
    //access named capture group to get the cost
    let cost = parseFloat(labelText.match(regexCost)[1]);
    if(clickedCheckbox.is(":checked")){
        totalCost += cost;
        //once a checkbox is clicked, remove any previous error
        let $legend = $('.activities').find('legend');
        $legend.next('.error').remove();
    } else {
        totalCost -= cost;
    }

    //update cost
    if($('.activities').has('p.total').length === 0) {
        $('.activities').append('<p class="total">'+ 'Total: $'+ totalCost +'</p>');
    } else {
        $('.activities p.total').text('Total: $'+ totalCost);
    }

    if(totalCost === 0) {
        $('.activities p.total').remove();
    }
});

//*******************//
//   Payment Info
//*******************//

$('#payment option').filter(':contains("Select Payment Method")').prop('disabled',true);
//initially display default payment option only
$('#payment option').filter(':contains("Credit Card")').prop('selected',true);
$('#credit-card ~ div').filter('div:contains("PayPal"), div:contains("Bitcoin")').hide();

$('#payment').on('change', function(){
    let value = $(this).find(':selected').text();
    //display payment option depending on selection
    $('#credit-card ~ div').filter('div:contains(' + value + ')').show();
    $('#credit-card ~ div').not('div:contains(' + value + ')').hide();
    if (value === 'Credit Card') {
        $('#credit-card').show();
    } else{
        $('#credit-card').hide();
    }
});

//*******************//
//   T-Shirt Info
//*******************//

$('#color').hide();
$('#colors-js-puns').append('<p class="theme">Please select a T-shirt theme</p>');
//initially hide color options, until a theme is selected
$('#design').on('change', function () {
    let theme = $(this).find(':selected').text();

    if(theme === 'Select Theme') {
        $('#color').hide();
        $('p.theme').show();
    } else {
        //show color option for theme selected
        $('p.theme').hide();
        $('#color').show();
        let regex = /Theme\s?-\s?(.+)/;
        let themeToMatch = theme.replace(regex,'$1');

        $('#color option').not(':contains(' + themeToMatch + ')').hide();
        //show matching options, with default first selected
        let optionsMatched = $('#color option').filter(':contains(' + themeToMatch + ')');
        optionsMatched.first().prop('selected',true);
        optionsMatched.show();
    }
});

//*******************//
//   Job Role
//*******************//

$('#other-title').hide();

$('#title').on('change', function () {
    let title = $(this).find('option:selected').text();
    if(title === 'Other') {
        $('#other-title').show();
    } else {
        $('#other-title').hide();
    }
});

//*******************//
//   Validation
//*******************//

//**- Input validation -**//
//**- validation for name,email,card number,zip code,cvv -**//

function processValidityOfInput(targetElement){
    //remove previous error
    targetElement.next('.error').remove();

    let value = targetElement.val();
    let pattern = '';
    let hint = '';

    //set test conditions based on the target element
    if( targetElement.is('#cc-num') ) {
        pattern = /^\d{13,16}$/;
        hint = ' must have 13 to 16 digits';
    } else if( targetElement.is('#zip') ) {
        pattern = /^\d{5}$/;
        hint = ' must have 5 digits';
    } else if( targetElement.is('#cvv') ) {
        pattern = /^\d{3}$/;
        hint = ' must have 3 digits';
    } else if( targetElement.is('#mail') ) {
        //email should not have spaces, have only one @ character
        //include 2-4 characters in domain eg: .co, .com, .info
        pattern = /^[^@\s]+@[^@.\s]+\.[a-z]{2,4}$/i;
        hint = ' address is not valid';
    } else if( targetElement.is('#name') ) {
        pattern = /^([a-zA-Z]+)[\s]*([a-zA-Z]+)?[\s]*$/;
        hint = ' must be entered as Firstname Lastname(optional), use alphabets only';
    }

    //test validity of input value
    let isValid = pattern.test(value);

    let errorText = "";
    //to build error text dynamically,
    //get corresponding label elements text (eg. 'Email')
    let labelPattern = /([a-zA-Z]+\s?[a-zA-Z]+)/;
    let $label = targetElement.prev('label');
    let labelText = $label.text().match(labelPattern)[0];

    let $error = $('<span class="error"></span>');
    //set error text for blank field or provide hint for invalid input
    if(value === "") {
        errorText = 'Please provide '+ labelText;
    } else if(!isValid) {
        errorText = labelText + hint;
    }
    //display error after element
    $error.text(errorText);
    $error.insertAfter(targetElement);
    //remove error for valid input
    if (isValid) {
        targetElement.next('.error').remove();
    }
    return isValid;
}

// To test validity of entry on input
// Attach event handler function for each input element
$('#cc-num, #zip, #cvv, #mail, #name').each(function(){
    $(this).on('input',function (event) {
        let target = $(event.target);
        processValidityOfInput(target);
    });
});

//**- Register for activities checkbox validation -**//

function checkboxValidity(fieldset) {
    let isChecked = fieldset.find('input[type="checkbox"]').is(':checked');
    //remove previous error
    let $legend = fieldset.find('legend');
    $legend.next('.error').remove();

    let $error = $('<span class="error">Please select atleast one activity</span>');

    if(!isChecked) {
        $error.insertAfter($legend);
    } else {
        $legend.next('.error').remove();
    }
    return isChecked;
}

//**- Form validation on submit -**//

function formValidity(event) {
    //event.preventDefault();
    let isChecked = false;
    let notValid = 0;
    let formElementsValidity = false;

    //get checkbox validity
    let $fieldset = $('.activities');
    isChecked = checkboxValidity($fieldset);

    //check validity of input
    function getValidity (collection) {
        collection.each(function(){
            let element = $(this);
            let isValid = processValidityOfInput(element);

            if(!isValid) {
                notValid += 1;
            }
        });
    }

    let collection = $('#name, #mail');
    getValidity(collection);
    //check  validity of credit card info only if selected
    if($('#payment').find(':selected').text() === 'Credit Card') {
        collection = $('#cc-num, #zip, #cvv');
        getValidity(collection);
    }

    formElementsValidity = isChecked && (notValid === 0);

    let $hint = $('<span>Please correct invalid entries before submitting!</span>');
    $('form').append($hint);
    $hint.hide();
    //show validation result
    if(!formElementsValidity) {
        event.preventDefault();
        $hint.attr('class','error');
        $hint.slideDown('slow').delay(2000).slideUp('slow');
    } else if(formElementsValidity) {
        return;
    }
}

$('form').on('submit', formValidity);