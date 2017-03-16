var xTurn = true;

$('.info-card').click(function() {
    if ($(this).hasClass('free-box')) {
        getQuestion($(this));
    }
});

function getQuestion($cardSelected) {
    //create new view, with different
    $.get('/question?q='+$cardSelected.attr('position'), function(data) {
        $('#questionModal').off().on('show.bs.modal', function() {
            $('#questionModal .modal-body').html(data.question);

            var btnsHtml = '';

            for (var i = 0; i < data.btns.length; i++) {
                btnsHtml += data.btns[i];
            }
            $('#questionModal .modal-footer').html(btnsHtml);


            $('.submit-response').off().click(function() {
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
                    var player = xTurn ? 'x' : 'o';

                    if (result.token === 'success') {
                        $cardSelected.removeClass('free-box');
                        $cardSelected.children('.back').children('#' + player + '-img').css('display', 'block');
                        $cardSelected.children('.front').css('-webkit-transform', 'rotateY(180deg)');
                        $cardSelected.children('.back').css('-webkit-transform', 'rotateY(0)');
                        $cardSelected.attr('x-or-o', player);
                    }

                    var playerWins = isWin(player);

                    if (playerWins) {
                        console.log("here");
                        $('#resultModal').off().on('show.bs.modal', function() {
                            $('#result').html('Congratulations! ' + player.toUpperCase() + ' wins!');
                            $('#resultModal .modal-body p').html('');

                            $('#resultModal').on('hide.bs.modal', function() {
                                resetGame();
                            })
                        });

                        $('#resultModal').modal('show');
                        xTurn = true;
                    } else if (xTurn) {
                        $('#x-turn-alert').slideUp();
                        setTimeout(function() {
                            $('#o-turn-alert').slideDown();
                        }, 400);

                        xTurn = !xTurn;
                    } else {
                        $('#o-turn-alert').slideUp();
                        setTimeout(function() {
                            $('#x-turn-alert').slideDown();
                        }, 400);
                        xTurn = !xTurn;

                        setTimeout(function() {

                        }, 5000);
                    }
                });
            })
        });

        $('#questionModal').modal('show');
    });
}

function isWin(player) {
    var rows = [],
        rowVals = [];

    $('.info-card').each(function() {
        rowVals.push($(this).attr('x-or-o'));

        if (rowVals.length === 3) {
            rows.push(rowVals);
            rowVals = [];
        }
    });

    return threeInARow(rows, player);
}

function threeInARow(rows, player) {
    if (rows[0][0] === player && rows[0][1] === player && rows[0][2] === player) {
        return true;
    } else if (rows[0][0] === player && rows[1][0] === player && rows[2][0] === player) {
        return true;
    } else if (rows[0][0] === player && rows[1][1] === player && rows[2][2] === player) {
        return true;
    } else if (rows[0][1] === player &&  rows[1][1] === player && rows[2][1] === player) {
        return true;
    } else if (rows[0][2] === player &&  rows[1][2] === player && rows[2][2] === player) {
        return true;
    } else if (rows[0][2] === player && rows[1][1] === player && rows[2][0] === player) {
        return true;
    } else if (rows[1][0] === player && rows[1][1] === player && rows[1][2] === player) {
        return true;
    } else if (rows[2][0] === player && rows[2][1] === player && rows[2][2] === player) {
        return true;
    } else {
        return false;
    }
}

function resetGame() {
    $('.info-card').each(function() {
        $(this).attr('x-or-o', '-');

        $(this).children('.front').css('-webkit-transform', 'rotateY(0)');
        $(this).children('.back').css('-webkit-transform', 'rotateY(180deg)');

        $(this).addClass('free-box');
    });

    $('#o-turn-alert').slideUp();
    setTimeout(function() {
        $('#x-turn-alert').slideDown();
    }, 400);
}


resetGame();