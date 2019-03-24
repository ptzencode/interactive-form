
//register for activities
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
