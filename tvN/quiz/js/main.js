let init_display = (keys) => {
  let set_display = (keys) => {
    let height = keys.css('height');
    let height_ = parseInt(height);
    keys.css('width', height);
    keys.css('line-height', (height_+4)+'px');
    keys.css('font-size', height_/3);
  }
  set_display(keys);
  $(window).resize(() => {
    set_display(keys);
  })
  $.each(keys, (i, v) => {
    let key = $(v);
    key.html(key.data('key'));
  });
}


let set_case = (case_) => {
  $('[data-case]').removeClass('on');
  $('[data-case='+case_+']').addClass('on');
}


let set_quiz = () => {

  let quiz = data[Math.floor(Math.random()*data.length)];
  let inputs = quiz.inputs;
  let operations = quiz.operations;

  let output = parseInt(inputs[0]);
  let description = inputs[0]
  for (let i=0; i<operations.length; i++) {
    let operation = operations[i];
    let input = inputs[i+1];
    let input_ = parseInt(input);
    description += ' '+operation+' '+input
    output = operation == '+' ? output+input_ : output-input_;
  }
  output += '';

  $('[data-description]').html(description);
  set_case('i');

  return output;
}


$(document).ready(() => {

  let config = $('[data-config]');
  let time_pressure = config.data('time-pressure');

  let answer = '';
  let answer_view = $('[data-answer]');
  let countdown = time_pressure;
  let keys = $('[data-key]');
  init_display(keys)

  let supervisor = setInterval(() => {
    $('[data-countdown]').html(countdown);
    if (countdown == 0) {
      keys.unbind('click');
      answer = '';
      answer_view.html('?');
      countdown = time_pressure;
      set_case('x');
    } else {
      if (countdown == time_pressure) {
        output = set_quiz();
        keys.click((e) => {
          let key = $(e.currentTarget);
          answer += key.data('key');
          answer_view.html(answer);
          if (output == answer){
            clearInterval(supervisor);
            set_case('o');
          }
          key.addClass('clicked');
          setTimeout(() => {
            key.removeClass('clicked');
          }, 200);
        });
      }
      console.log(output);
      countdown -= 1;
    }
  }, 1000)
});


let data = [
  {
    "inputs": [
      "49",
      "53"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "55",
      "47"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "46",
      "57"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "16",
      "87"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "63",
      "42"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "21",
      "86"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "63",
      "45"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "11",
      "98"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "27",
      "99"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "38",
      "89"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "32",
      "96"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "58",
      "78"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "46",
      "91"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "61",
      "77"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "57",
      "89"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "57",
      "91"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "54",
      "96"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "63",
      "93"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "69",
      "88"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "61",
      "97"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "65",
      "93"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "65",
      "94"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "69",
      "91"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "73",
      "89"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "75",
      "88"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "77",
      "87"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "79",
      "86"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "83",
      "84"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "71",
      "97"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "88",
      "87"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "28",
      "109"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "33",
      "114"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "41",
      "122"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "43",
      "124"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "44",
      "125"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "48",
      "124"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "46",
      "127"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "49",
      "130"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "52",
      "133"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "54",
      "135"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "56",
      "137"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "57",
      "138"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "58",
      "139"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "60",
      "141"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "54",
      "235"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "50",
      "257"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "27",
      "452"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "45",
      "464"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "66",
      "464"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "51",
      "545"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "57",
      "553"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "57",
      "618"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "42",
      "653"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "60",
      "645"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "69",
      "645"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "72",
      "648"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "78",
      "648"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "35",
      "857"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "75",
      "862"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "63",
      "883"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "139",
      "145"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "105",
      "135"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "111",
      "135"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "113",
      "146"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "109",
      "158"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "140",
      "146"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "142",
      "148"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "144",
      "150"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "145",
      "151"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "146",
      "152"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "148",
      "154"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "149",
      "155"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "150",
      "156"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "151",
      "157"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "152",
      "158"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "155",
      "161"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "156",
      "162"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "160",
      "166"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "161",
      "167"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "167",
      "173"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "160",
      "256"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "161",
      "257"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "165",
      "261"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "166",
      "262"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "170",
      "266"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "171",
      "267"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "177",
      "273"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "180",
      "276"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "181",
      "277"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "182",
      "278"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "183",
      "279"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "185",
      "282"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "186",
      "282"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "361",
      "108"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "187",
      "283"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "188",
      "284"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "190",
      "286"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "191",
      "287"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "192",
      "288"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "193",
      "289"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "195",
      "291"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "372",
      "114"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "197",
      "293"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "198",
      "294"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "200",
      "296"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "201",
      "297"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "203",
      "299"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "383",
      "120"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "204",
      "300"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "205",
      "301"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "394",
      "126"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "405",
      "132"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "427",
      "144"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "471",
      "168"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "493",
      "180"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "526",
      "198"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "537",
      "204"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "570",
      "222"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "423",
      "389"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "592",
      "234"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "603",
      "240"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "423",
      "428"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "423",
      "431"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "423",
      "434"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "423",
      "440"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "436",
      "429"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "436",
      "435"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "436",
      "438"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "449",
      "442"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "636",
      "258"
    ],
    "operations": [
      "+"
    ]
  },
  {
    "inputs": [
      "522",
      "385"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "710",
      "572"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "543",
      "387"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "722",
      "563"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "730",
      "557"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "564",
      "389"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "734",
      "554"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "357",
      "165"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "585",
      "391"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "359",
      "164"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "361",
      "163"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "363",
      "162"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "365",
      "161"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "367",
      "160"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "369",
      "159"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "373",
      "157"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "375",
      "156"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "387",
      "150"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "389",
      "149"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "393",
      "147"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "395",
      "146"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "401",
      "143"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "403",
      "142"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "405",
      "141"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "407",
      "140"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "669",
      "399"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "409",
      "139"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "411",
      "138"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "413",
      "137"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "415",
      "136"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "419",
      "134"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "690",
      "401"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "423",
      "132"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "425",
      "131"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "427",
      "130"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "433",
      "127"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "711",
      "403"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "436",
      "118"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "438",
      "112"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "732",
      "405"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "839",
      "510"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "753",
      "407"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "849",
      "500"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "853",
      "496"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "855",
      "494"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "774",
      "409"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "857",
      "492"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "859",
      "490"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "865",
      "484"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "795",
      "411"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "867",
      "482"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "816",
      "413"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "985",
      "546"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "967",
      "510"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "965",
      "506"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "879",
      "419"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "963",
      "502"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "961",
      "498"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "959",
      "494"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "957",
      "490"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "955",
      "486"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "953",
      "482"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "951",
      "478"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "949",
      "474"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "900",
      "421"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "945",
      "466"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "943",
      "462"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "921",
      "423"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "942",
      "425"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "963",
      "427"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "1346",
      "962"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "1036",
      "641"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "1062",
      "632"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "1399",
      "920"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "1108",
      "623"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "1144",
      "614"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "1452",
      "878"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "1180",
      "604"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "1216",
      "596"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "1028",
      "388"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "1505",
      "834"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "1081",
      "410"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "1262",
      "587"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "1134",
      "432"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "1288",
      "578"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "1664",
      "944"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "1187",
      "455"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "1324",
      "568"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "1717",
      "953"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "1240",
      "476"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "1293",
      "498"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "1468",
      "666"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "1360",
      "529"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "1826",
      "987"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "1823",
      "978"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "1396",
      "551"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "1611",
      "765"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "1432",
      "541"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "1770",
      "854"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "1555",
      "581"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "1684",
      "1564"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "3385",
      "3259"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "1338",
      "1182"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "1648",
      "1468"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "1865",
      "1683"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "2468",
      "2275"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "4538",
      "4335"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "3684",
      "3448"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "4176",
      "3881"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "2545",
      "2156"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "3867",
      "3457"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "4589",
      "4172"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "4353",
      "3935"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "5684",
      "5257"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "4412",
      "3953"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "2986",
      "2523"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "5626",
      "5141"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "5705",
      "5214"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "3874",
      "3381"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "4471",
      "3973"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "3689",
      "3142"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "4530",
      "3944"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "2846",
      "2245"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "5747",
      "5128"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "2898",
      "2217"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "5768",
      "5085"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "1876",
      "1192"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "5789",
      "5043"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "5811",
      "4999"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "5831",
      "4956"
    ],
    "operations": [
      "-"
    ]
  },
  {
    "inputs": [
      "69",
      "23",
      "15"
    ],
    "operations": [
      "+",
      "+"
    ]
  },
  {
    "inputs": [
      "98",
      "25",
      "13"
    ],
    "operations": [
      "+",
      "+"
    ]
  },
  {
    "inputs": [
      "86",
      "16",
      "38"
    ],
    "operations": [
      "+",
      "+"
    ]
  },
  {
    "inputs": [
      "83",
      "12",
      "54"
    ],
    "operations": [
      "+",
      "+"
    ]
  },
  {
    "inputs": [
      "17",
      "66",
      "79"
    ],
    "operations": [
      "+",
      "+"
    ]
  },
  {
    "inputs": [
      "48",
      "37",
      "94"
    ],
    "operations": [
      "+",
      "+"
    ]
  },
  {
    "inputs": [
      "98",
      "64",
      "25"
    ],
    "operations": [
      "+",
      "+"
    ]
  },
  {
    "inputs": [
      "36",
      "65",
      "89"
    ],
    "operations": [
      "+",
      "+"
    ]
  },
  {
    "inputs": [
      "32",
      "95",
      "76"
    ],
    "operations": [
      "+",
      "+"
    ]
  },
  {
    "inputs": [
      "85",
      "96",
      "77"
    ],
    "operations": [
      "+",
      "+"
    ]
  },
  {
    "inputs": [
      "47",
      "23",
      "140"
    ],
    "operations": [
      "+",
      "+"
    ]
  },
  {
    "inputs": [
      "33",
      "37",
      "168"
    ],
    "operations": [
      "+",
      "+"
    ]
  },
  {
    "inputs": [
      "69",
      "14",
      "182"
    ],
    "operations": [
      "+",
      "+"
    ]
  },
  {
    "inputs": [
      "97",
      "71",
      "196"
    ],
    "operations": [
      "+",
      "+"
    ]
  },
  {
    "inputs": [
      "77",
      "39",
      "266"
    ],
    "operations": [
      "+",
      "+"
    ]
  },
  {
    "inputs": [
      "69",
      "95",
      "294"
    ],
    "operations": [
      "+",
      "+"
    ]
  },
  {
    "inputs": [
      "45",
      "37",
      "378"
    ],
    "operations": [
      "+",
      "+"
    ]
  },
  {
    "inputs": [
      "49",
      "49",
      "420"
    ],
    "operations": [
      "+",
      "+"
    ]
  },
  {
    "inputs": [
      "32",
      "99",
      "504"
    ],
    "operations": [
      "+",
      "+"
    ]
  },
  {
    "inputs": [
      "65",
      "84",
      "546"
    ],
    "operations": [
      "+",
      "+"
    ]
  },
  {
    "inputs": [
      "41",
      "213",
      "239"
    ],
    "operations": [
      "+",
      "+"
    ]
  },
  {
    "inputs": [
      "61",
      "388",
      "131"
    ],
    "operations": [
      "+",
      "+"
    ]
  },
  {
    "inputs": [
      "30",
      "325",
      "283"
    ],
    "operations": [
      "+",
      "+"
    ]
  },
  {
    "inputs": [
      "69",
      "435",
      "227"
    ],
    "operations": [
      "+",
      "+"
    ]
  },
  {
    "inputs": [
      "93",
      "313",
      "344"
    ],
    "operations": [
      "+",
      "+"
    ]
  },
  {
    "inputs": [
      "77",
      "202",
      "475"
    ],
    "operations": [
      "+",
      "+"
    ]
  },
  {
    "inputs": [
      "56",
      "307",
      "530"
    ],
    "operations": [
      "+",
      "+"
    ]
  },
  {
    "inputs": [
      "48",
      "106",
      "751"
    ],
    "operations": [
      "+",
      "+"
    ]
  },
  {
    "inputs": [
      "87",
      "620",
      "217"
    ],
    "operations": [
      "+",
      "+"
    ]
  },
  {
    "inputs": [
      "67",
      "135",
      "755"
    ],
    "operations": [
      "+",
      "+"
    ]
  },
  {
    "inputs": [
      "224",
      "59",
      "26"
    ],
    "operations": [
      "-",
      "-"
    ]
  },
  {
    "inputs": [
      "308",
      "65",
      "73"
    ],
    "operations": [
      "-",
      "-"
    ]
  },
  {
    "inputs": [
      "238",
      "12",
      "28"
    ],
    "operations": [
      "-",
      "-"
    ]
  },
  {
    "inputs": [
      "324",
      "69",
      "51"
    ],
    "operations": [
      "-",
      "-"
    ]
  },
  {
    "inputs": [
      "392",
      "98",
      "54"
    ],
    "operations": [
      "-",
      "-"
    ]
  },
  {
    "inputs": [
      "336",
      "57",
      "29"
    ],
    "operations": [
      "-",
      "-"
    ]
  },
  {
    "inputs": [
      "406",
      "54",
      "45"
    ],
    "operations": [
      "-",
      "-"
    ]
  },
  {
    "inputs": [
      "434",
      "34",
      "53"
    ],
    "operations": [
      "-",
      "-"
    ]
  },
  {
    "inputs": [
      "554",
      "48",
      "70"
    ],
    "operations": [
      "-",
      "-"
    ]
  },
  {
    "inputs": [
      "762",
      "34",
      "15"
    ],
    "operations": [
      "-",
      "-"
    ]
  },
  {
    "inputs": [
      "354",
      "148",
      "76"
    ],
    "operations": [
      "-",
      "-"
    ]
  },
  {
    "inputs": [
      "795",
      "589",
      "59"
    ],
    "operations": [
      "-",
      "-"
    ]
  },
  {
    "inputs": [
      "358",
      "187",
      "21"
    ],
    "operations": [
      "-",
      "-"
    ]
  },
  {
    "inputs": [
      "422",
      "169",
      "64"
    ],
    "operations": [
      "-",
      "-"
    ]
  },
  {
    "inputs": [
      "716",
      "485",
      "37"
    ],
    "operations": [
      "-",
      "-"
    ]
  },
  {
    "inputs": [
      "606",
      "317",
      "81"
    ],
    "operations": [
      "-",
      "-"
    ]
  },
  {
    "inputs": [
      "791",
      "568",
      "13"
    ],
    "operations": [
      "-",
      "-"
    ]
  },
  {
    "inputs": [
      "531",
      "193",
      "70"
    ],
    "operations": [
      "-",
      "-"
    ]
  },
  {
    "inputs": [
      "846",
      "522",
      "23"
    ],
    "operations": [
      "-",
      "-"
    ]
  },
  {
    "inputs": [
      "681",
      "156",
      "44"
    ],
    "operations": [
      "-",
      "-"
    ]
  },
  {
    "inputs": [
      "949",
      "595",
      "246"
    ],
    "operations": [
      "-",
      "-"
    ]
  },
  {
    "inputs": [
      "413",
      "156",
      "137"
    ],
    "operations": [
      "-",
      "-"
    ]
  },
  {
    "inputs": [
      "386",
      "119",
      "137"
    ],
    "operations": [
      "-",
      "-"
    ]
  },
  {
    "inputs": [
      "815",
      "200",
      "478"
    ],
    "operations": [
      "-",
      "-"
    ]
  },
  {
    "inputs": [
      "818",
      "248",
      "354"
    ],
    "operations": [
      "-",
      "-"
    ]
  },
  {
    "inputs": [
      "754",
      "364",
      "154"
    ],
    "operations": [
      "-",
      "-"
    ]
  },
  {
    "inputs": [
      "656",
      "272",
      "145"
    ],
    "operations": [
      "-",
      "-"
    ]
  },
  {
    "inputs": [
      "797",
      "227",
      "284"
    ],
    "operations": [
      "-",
      "-"
    ]
  },
  {
    "inputs": [
      "762",
      "223",
      "148"
    ],
    "operations": [
      "-",
      "-"
    ]
  },
  {
    "inputs": [
      "877",
      "288",
      "187"
    ],
    "operations": [
      "-",
      "-"
    ]
  },
  {
    "inputs": [
      "50",
      "266",
      "147"
    ],
    "operations": [
      "+",
      "-"
    ]
  },
  {
    "inputs": [
      "54",
      "336",
      "211"
    ],
    "operations": [
      "+",
      "-"
    ]
  },
  {
    "inputs": [
      "48",
      "436",
      "288"
    ],
    "operations": [
      "+",
      "-"
    ]
  },
  {
    "inputs": [
      "65",
      "824",
      "605"
    ],
    "operations": [
      "+",
      "-"
    ]
  },
  {
    "inputs": [
      "69",
      "847",
      "619"
    ],
    "operations": [
      "+",
      "-"
    ]
  },
  {
    "inputs": [
      "41",
      "992",
      "732"
    ],
    "operations": [
      "+",
      "-"
    ]
  },
  {
    "inputs": [
      "29",
      "557",
      "260"
    ],
    "operations": [
      "+",
      "-"
    ]
  },
  {
    "inputs": [
      "18",
      "575",
      "187"
    ],
    "operations": [
      "+",
      "-"
    ]
  },
  {
    "inputs": [
      "97",
      "680",
      "253"
    ],
    "operations": [
      "+",
      "-"
    ]
  },
  {
    "inputs": [
      "28",
      "746",
      "198"
    ],
    "operations": [
      "+",
      "-"
    ]
  },
  {
    "inputs": [
      "20",
      "210",
      "38"
    ],
    "operations": [
      "+",
      "-"
    ]
  },
  {
    "inputs": [
      "82",
      "252",
      "61"
    ],
    "operations": [
      "+",
      "-"
    ]
  },
  {
    "inputs": [
      "63",
      "280",
      "17"
    ],
    "operations": [
      "+",
      "-"
    ]
  },
  {
    "inputs": [
      "53",
      "350",
      "17"
    ],
    "operations": [
      "+",
      "-"
    ]
  },
  {
    "inputs": [
      "49",
      "364",
      "15"
    ],
    "operations": [
      "+",
      "-"
    ]
  },
  {
    "inputs": [
      "39",
      "448",
      "57"
    ],
    "operations": [
      "+",
      "-"
    ]
  },
  {
    "inputs": [
      "29",
      "476",
      "49"
    ],
    "operations": [
      "+",
      "-"
    ]
  },
  {
    "inputs": [
      "43",
      "518",
      "94"
    ],
    "operations": [
      "+",
      "-"
    ]
  },
  {
    "inputs": [
      "21",
      "490",
      "43"
    ],
    "operations": [
      "+",
      "-"
    ]
  },
  {
    "inputs": [
      "54",
      "532",
      "89"
    ],
    "operations": [
      "+",
      "-"
    ]
  },
  {
    "inputs": [
      "379",
      "414",
      "613"
    ],
    "operations": [
      "+",
      "-"
    ]
  },
  {
    "inputs": [
      "570",
      "219",
      "607"
    ],
    "operations": [
      "+",
      "-"
    ]
  },
  {
    "inputs": [
      "175",
      "531",
      "398"
    ],
    "operations": [
      "+",
      "-"
    ]
  },
  {
    "inputs": [
      "813",
      "180",
      "523"
    ],
    "operations": [
      "+",
      "-"
    ]
  },
  {
    "inputs": [
      "453",
      "126",
      "107"
    ],
    "operations": [
      "+",
      "-"
    ]
  },
  {
    "inputs": [
      "487",
      "229",
      "199"
    ],
    "operations": [
      "+",
      "-"
    ]
  },
  {
    "inputs": [
      "829",
      "497",
      "744"
    ],
    "operations": [
      "+",
      "-"
    ]
  },
  {
    "inputs": [
      "367",
      "426",
      "168"
    ],
    "operations": [
      "+",
      "-"
    ]
  },
  {
    "inputs": [
      "685",
      "269",
      "325"
    ],
    "operations": [
      "+",
      "-"
    ]
  },
  {
    "inputs": [
      "574",
      "457",
      "295"
    ],
    "operations": [
      "+",
      "-"
    ]
  }
];
