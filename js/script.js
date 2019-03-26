
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

