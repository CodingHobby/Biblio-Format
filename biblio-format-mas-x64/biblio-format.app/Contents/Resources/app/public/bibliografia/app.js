// DOM element variables
var outputP
var submit
var add
var main
var init
var inputs = []
var deletes = []


// Arrays for inputs
var values = []

// Output paragraph
var outP

function setup() {
    // Select existing elements
    add = select('#addBtn')
    submit = select('#submitBtn')
    init = select('#init')
    outP = select('#output')
        // Add the first input to the inputs array
    inputs.push(init)

    // Add event to create new paragraphs
    add.mouseClicked(createNew)
        // Add event to submit the whole form
    submit.mouseClicked(submitFun)
    noCanvas()
    noLoop()
        // Select the whole form, which we'll use as our canvas
    main = select('#form')
}

// String Formatting function
String.format = function (format) {
    var args = Array.prototype.slice.call(arguments, 1)
    return format.replace(/{(\d+)}/g, function (match, number) {
        return typeof args[number] != 'undefined' ?
            args[number] :
            match
    })
}

// Function to create a new Input field
function createNew() {
    // Creating all the divs necessary
    var thisDiv = createDiv('')
    var radioDiv = createDiv('')
    var outerRadio = createDiv('')
    var outerInput = createDiv('')
    var deleteDiv = createDiv('')

    // Input label
    var inputLabel = createElement('label', 'Dati\n')
        // Input field
    var dati = createInput('')
    dati.attribute('placeholder', 'Dati')
        // Hr element
    var hr = createElement('hr', '')
        // Delete Button
    var deleteBtn = createButton('')

    // Adding icon to the button
    deleteBtn.html('<i class="fa fa-trash"></i> Rimuovi')
    deleteBtn.addClass('btn btn-danger')

    // Adding bootstrap to everything
    dati.addClass('form-control')

    thisDiv.addClass('form-group')
    outerInput.addClass('form-group')
    outerRadio.addClass('form-group')
    deleteDiv.addClass('form-group')
    radioDiv.addClass('row')
    radioDiv.id('radios')
    inputLabel.addClass('lead')
    deleteBtn.attribute('type', 'button')


    // Setting everything's parent
    thisDiv.parent(main)
    hr.parent(thisDiv)

    outerInput.parent(thisDiv)
    inputLabel.parent(outerInput)
    dati.parent(outerInput)

    deleteDiv.parent(thisDiv)
    deleteBtn.parent(deleteDiv)

    // Stuff necessary to delete the input field (and other stuff) that was just created
    var toDelete = {
        text: dati,
        button: deleteBtn,
        label: inputLabel,
        hr: hr,
        number: inputs.length - 2
    }

    // Add toDelete to an array of objects with the deletion information
    deletes.push(toDelete)
        // Add event listener to the delete button
    deleteBtn.mouseClicked(function () {
            removeIt(toDelete)
        })
        // Add the current input field to the inputs array
    inputs.push(dati);
}


// Function to remove an element
function removeIt(data) {
    // Get the input field you're trying to delete
    var current = data.text
        // Splice the input field from the array
    inputs.splice(data.number, 1)
        // Remove the DOM elements
    current.remove()
    data.button.remove()
    data.label.remove()
    data.hr.remove()
}

// Function to submit everything
function submitFun() {
    // Reset the output paragraph
    outP.html('')
        // Variables for the output
    var res
    var output = []
    var out = ''
    values = []
        // Add stuff to the array of values
    for (var i = 0; i < inputs.length; i++) {
        values.push(inputs[i].value())
    }
    // Tokenize the string
    res = values.map(data => data.split('  '))
        // Add object's information to an array
    for (var i = 0; i < res.length; i++) {
        output[i] = {}
        output[i].tipo = res[i][0]
        output[i].autori = res[i][1]
        output[i].titolo = res[i][2]
        output[i].anno = res[i][3]
        output[i].edizione = res[i][4]
        output[i].luogo = res[i][5]
        output[i].editore = res[i][6]
        output[i].in = res[i][7]
        output[i].di = res[i][8].split(' & ')
            .map(aut => aut.split(' '))
    }
    // Format everything
    outP.html(format(output))
}

function format(data) {
    for (var i = 0; i < data.length; i++) {
        var current = data[i]
            // Autori in un Array
        if (current.autori) {
            current.autori = current.autori.split(' & ')
                .map(aut => aut.split(' '))
        } else {
            // Se non ci sono autori
            current.autori = 'Anon.'
        }

        if (current.di) {
            current.di = current.di.split(' & ')
                .map(aut => aut.split(' '))
        } else {
            // Se non ci sono autori
            current.autori = 'Anon.'
        }
        // Se non c'è l'Anno
        if (!current.anno || current.anno == '') current.anno = 'S.d'

        // Se non c'è l'edizione
        if (!current.edizione || current.edizione == '') current.edizione = 1

        // Se non c'è il Luogo
        if (!current.luogo || current.lugo == '') current.luogo = 'S.l'

        // se non c'è l'Editore
        if (!current.editore || current.editore == '') current.editore = 'S.n'

        // Nel caso in cui non ci sia un titolo
        if (!current.titolo || current.titolo == '') return "L'output comparirà qui"

        // Formattazione basata sul tipo
        switch (current.tipo) {
            case '':
                return defFormat(data)
            case 'Articolo':
                return artFormat(data)
            default:
                return defFormat(data)
        }
    }
}

function defFormat(data) {
    var res = ''
    for (var i = 0; i < data.length; i++) {
        current = data[i]
            // Autori
        var n = 0
        for (var j = 0; j < current.autori.length; j++) {
            n++
            if (n < current.autori[j].length) {
                res += current.autori[j][1] + ' ' + current.autori[j][0].split('')[0].toUpperCase() + '.; '
            } else {
                res += current.autori[j][1] + ' ' + current.autori[j][0].split('')[0].toUpperCase() + '. '
            }
        }
        // Data
        res += String.format('({0}). ', current.anno)

        // Titolo
        res += '<i>' + current.titolo + '</i>. '

        // Edizione
        res += (current.edizione && current.edizione != 1) ? String.format('{0}a ediz. ') : ''

        // Luogo
        res += current.luogo + ': '

        // Editore
        res += current.editore + '.\n'
    }
    return res
}

function artFormat(data) {
    var res = ''
    for (var i = 0; i < data.length; i++) {
        current = data[i]
            // Autori
        var n = 0
        for (var j = 0; j < current.autori.length; j++) {
            n++
            if (n < current.autori[j].length) {
                res += current.autori[j][1] + ' ' + current.autori[j][0].split('')[0].toUpperCase() + '.; '
            } else {
                res += current.autori[j][1] + ' ' + current.autori[j][0].split('')[0].toUpperCase() + '. '
            }
        }
        // Data
        res += String.format('({0}). ', current.anno)

        // Titolo
        res += '<i>' + current.titolo + '</i>. '

        // In
        res += ' in ' + current.in

        // Di
        res += ' di ' + current.di[1] + ' ' + current.di[0].spilt('')[0].toUpperCase() + '. '

        // Edizione
        res += (current.edizione && current.edizione != 1) ? String.format('{0}a ediz. ') : ''

        // Luogo
        res += current.luogo + ': '

        // Editore
        res += current.editore + '.\n'
    }
    return res
}