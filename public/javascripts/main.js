$('.free-box').click(function() {
    getQuestion();

    $(this).removeClass('free-box');
});

function getQuestion() {
    //create new view, with different
    $.get('/question', function(data) {
        $('#questionModal').off().on('show.bs.modal', function() {
            $('#questionModal .modal-body').html(data.question);

            var btnsHtml = '';

            for (var i = 0; i < data.btns.length; i++) {
                btnsHtml += data.btns[i];
            }
            $('#questionModal .modal-footer').html(btnsHtml);


            $('.submit-response').off().click(function() {
            console.log($(this).html(), $(this).attr('question'))
                if (parseInt($(this).attr('question')) === 0 || parseInt($(this).attr('question')) === 4 ||
                    parseInt($(this).attr('question')) === 5) {
                    var userAnswer = $(this).html();
                } else {
                    var userAnswer = $('#user-answer').val();
                }

                var data = {
                    qNum: $(this).attr('question'),
                    userAnswer: userAnswer
                }

                $.post('/answer', data, function(result) {
                    if (result.token === 'success') {

                    } else {

                    }
                });
            })
        });

        $('#questionModal').modal('show');
    });
}