// INSERT DATA 
  var id = $('#id');  
  var title = $('#title');
  var cycle = $('#cycle');
  var certificate = $('#certificate');
  var institution = $('#institution');
  var phone = $('#phone');
  var street = $('#street');
  var suburb = $('#suburb');
  var town = $('#town');
  var company = $('#company');
  var cp = $('#cp');
  var c_street = $('#c_street');
  var c_suburb = $('#c_suburb');
  var c_town = $('#c_town');
  var product = $('#product');
  var scaffold = $('#scaffold');
  var crust = $('#crust option:selected');
  var thick = $('#thick');
  var quantity = $('#quantity');
  var start = $('#spanStart').text();
  var end = $('#spanStop').text();
  
var $aux;  

var socket = io();

// SET CHART 

socket.on('stopSensor', function(sensor) {
  var setData = {id: $('#id').text(), status: true};
    var id={id: $('#id').text()};
      $.ajax({
        url : "/endCycle",
        type: "POST",
        data : setData,
        success: function(data)
        {
          var text = JSON.stringify(data);
          obj = JSON.parse(text);
          console.log(obj.end);
          $('#spanStop').text(obj.end);
           window.location.href = '/chart/'+id.id;    
           
        },
        error: function (jqXHR, textStatus, errorThrown)
        {
     
        }
    });  
});

var data ={labels:[0],series:[[0],[0],[0],[0],[0]]};

socket.on('panelSensor',function(sensor){
  var sensorStr = JSON.stringify(sensor);
    var data = JSON.parse(sensorStr);  
    
    var s1,s2,s3,s4;
    s1=data.s1; s2=data.s2; s3=data.s3;  s4=data.s4;
    $('#sensor1').text(s1+" °C"); $('#sensor2').text(s2+" °C"); $('#sensor3').text(s3+" °C"); $('#sensor4').text(s4+" °C");
   
});

socket.on('dataSensors', function(sensor) {
  if (sensor.msg != 'error') {
    var sensorStr = JSON.stringify(sensor);
    var $obj = JSON.parse(sensorStr);  
    
    $aux.data = $obj;
    console.log($obj);
    $aux.update();
  }else{
    alert('Mal funionamiento de los sensores');
    $('#verifySensors').hide();
  }
});

chart();

function chart () {
  var align ={
    top: 20,
    right: 20,
    bottom: 45,
    left: 10
  }; 
  var set_Text ={
      axisX: {
        axisTitle: 'HH:mm',
        axisClass: 'ct-axis-title',
        offset: {
          x: 0,
          y: 40
        },
        textAnchor: 'middle'
      },
      axisY: {
        axisTitle: 'Temperature',
        axisClass: 'ct-axis-title',
        offset: {
          x: 0,
          y: 10
        },
        textAnchor: 'middle',
        flipTitle: true
      }
    }; 
  var option ={
    width:800,height:400,
    showPoint: false,
    chartPadding: align,
    axisY: {
      nlyInteger: true
    },
    plugins: [
      Chartist.plugins.ctAxisTitle(set_Text)
    ]
  };
  var responsive =[
    ['screen and (max-width: 800px)', {width: 700, height: 400, }]
  ];
  
  $aux =  new Chartist.Line('.ct-chart', data , option, responsive);
}

function report(el){
  var val = crust
  if ( val == "0") {
    var crust = "NO";
  }else{
    var crust = "SI";
  };
  var html='';
  html +='<div class="container">';

  html +='<div class="row"><div class="col-xs-12"><h3 align="center" >'+title.val()+'</h3></div></div>';
  html +='<div class="row"><div class="col-xs-8"><h4><strong>Ciclo: </strong>'+cycle.val()+$('#spanStart').text()+'</h4></div>';
  html +='<div class="col-xs-4"><h4 class="pull-right"><strong>Numero. : </strong>'+id.text()+'</h4></div></div>';
  html +='<div class="row"><div class="col-xs-12"><h4><strong>Certificado N. : </strong>'+certificate.val()+'</h4></div></div>';
 
  html +='<div class="row"><div class="col-xs-12">'+institution.val()+'</div>';
  html +='<div class="col-xs-12">'+street.val()+" tel. "+phone.val()+'</div>';
  html +='<div class="col-xs-12">'+suburb.val()+" "+town.val()+'</div></div></br>';

  html +='<div class="row"><div class="col-xs-12">'+company.val()+'</div>';
  html +='<div class="col-xs-12">'+c_street.val()+" "+cp.val()+'</div>';
  html +='<div class="col-xs-12">'+c_suburb.val()+" "+c_town.val()+'</div></div></br>';

  html +='<div class="row"><div class="col-xs-4"><strong>De:</strong></div><div class="col-xs-8">'+start+'</div>';
  html +='<div class="col-xs-4"><strong>A:</strong></div><div class="col-xs-8">'+end+'</div>';
  html +='<div class="col-xs-4"><strong>Tipo de producto: </strong></div><div class="col-xs-8">'+product.val()+'</div>';
  html +='<div class="col-xs-4"><strong>Tipo de tarimas: </strong></div><div class="col-xs-8">'+scaffold.val()+'</div>';
  html +='<div class="col-xs-4"><strong>Presencia de corteza:</strong></div><div class="col-xs-8">'+crust+'</div>';
  html +='<div class="col-xs-4"><strong>Grosor:</strong></div><div class="col-xs-8">'+thick.val()+'</div>';
  html +='<div class="col-xs-4"><strong>Cantidad:</strong></div><div class="col-xs-8">'+quantity.val()+'</div></div></br>';

  html +='<div class="row">';
  html +='<div class="col-xs-4"><strong>Humedad inizial:</strong></div><div class="col-xs-8"> 25% </div>';
  html +='<div class="col-xs-4"><strong>Temperatura de esterilizado:</strong></div><div class="col-xs-8">57 °C</div>';
  html +='</div>';

  html +='<div class="col-xs-4"><strong>Fecha inicio ciclo:</strong></div> <div class="col-xs-8">'+start+'</div>';

  html +='</div>';

  $('#report').append(html);
  var restorepage = document.body.innerHTML;

  var printcontent = document.getElementById(el).innerHTML;
  document.body.innerHTML = printcontent;
  window.print();
  document.body.innerHTML = restorepage;
  $('#report').empty();
}

function getData (val) {
  if (val == true){
    var formData={
      title: title.val(),
      cycle: cycle.val(),
      certificate: certificate.val(),
      institution: institution.val(),
      phone: phone.val(),
      street: street.val(),
      suburb: suburb.val(),
      town: town.val(),
      company: company.val(),
      cp: cp.val(),
      c_street: c_street.val(),
      c_suburb: c_suburb.val(),
      c_town: c_town.val(),
      product: product.val(),
      scaffold: scaffold.val(),
      crust: crust.val(),
      thick: thick.val(),
      quantity: quantity.val(),
      status: false
   };
  }else{
    var formData={
      title: title.val(),
      cycle: cycle.val(),
      certificate: certificate.val(),
      institution: institution.val(),
      phone: phone.val(),
      street: street.val(),
      suburb: suburb.val(),
      town: town.val(),
      company: company.val(),
      cp: cp.val(),
      c_street: c_street.val(),
      c_suburb: c_suburb.val(),
      c_town: c_town.val(),
      product: product.val(),
      scaffold: scaffold.val(),
      crust: crust.val(),
      thick: thick.val(),
      quantity: quantity.val()
    };
  }  
  return formData;
}

var grosor = "";
$('#crust').change(function () {
   
  var str = "";
  crust.each(function() {
    str += $( this ).text() + " ";
  });
  grosor = str;
  console.log(grosor);
}).change();

function update(){  
  $('#btnUpdate').on('click', function(e){
    var id = $('#id').text();
    var formData = getData(false);
    console.log(id);
    $.ajax({
        url : "/chart/put/"+id,
        type: "POST",
        data : formData,
        success: function(data)
        {
            console.log('success');
            $('#messageUpdate').append('<div class="alert alert-success fade in"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>Successfully Update</div>');
        },
        error: function (jqXHR, textStatus, errorThrown)
        {
     
        }
    });
  });
}

update();
// START 
var btnStart = $('#btnStart');

if (btnStart.hasClass('btn-danger')) {
  socket.emit('startChart', {msg: "success Start Chart View"});
  chart();
};

if ($('#spanStop').text()!="---") {
  socket.emit('showChart', {id: $('#id').text()});    
};

btnStart.on('click',function (e) {
   var $this = $(this);     
   $('#newChart').append('<div class="ct-chart" align="center" id="chart1"></div>');
   if($this.hasClass('btn-success')) {
      socket.emit('startChart', {msg: "success Start Chart on click"});
      chart();
      
      $('#btnShowUpdate').append('<button class="btn btn-success pull-right" id="btnUpdate">Actualizar</button>');
     
      $this.find('#txtStart').text('Detener');
      $this.removeClass('btn-success').addClass('btn-danger');      
      $this.find('i').removeClass('fa-play').addClass('fa-stop');      
      
      console.log(crust.val());
      var formData = getData(true);
      console.log(formData);
      console.log(formData.company);

      $.ajax({
          url : "/newCycle",
          type: "POST",
          data : formData,
          success: function(data)
          {

            var text = JSON.stringify(data);
            obj = JSON.parse(text);
            console.log('success');
            console.log(obj.data[0].date_start);

            title.val(obj.data[0].title);
            cycle.val(obj.data[0].cycle);
            certificate.val(obj.data[0].certificate);
            institution.val(obj.data[0].institution);
            phone.val(obj.data[0].phone);
            street.val(obj.data[0].street);
            suburb.val(obj.data[0].suburb);
            town.val(obj.data[0].town);
            company.val(obj.data[0].company);
            cp.val(obj.data[0].cp);
            c_street.val(obj.data[0].c_street);
            c_suburb.val(obj.data[0].c_suburb);
            c_town.val(obj.data[0].c_town);
            product.val(obj.data[0].product);
            scaffold.val(obj.data[0].scaffold);
            crust.val(obj.data[0].crust);
            thick.val(obj.data[0].thick);
            quantity.val(obj.data[0].quantity);
            $('#id').text(obj.data[0].id)
            $('#id').text()
            
            $("#btnUpdate").removeClass("hidden");
            $("#btnUpdate").addClass("show");
            console.log(data);
            $('#spanStart').text(obj.start);     

      
             // $('#message').append('<div class="alert alert-success fade in"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>Successfully Insert</div>');
          },
          error: function (jqXHR, textStatus, errorThrown)
          {        
          }
      });
   }
   else if($this.hasClass('btn-danger'))
   {
      $this.removeClass('btn-danger').addClass('hidden');
      var setData = {id: $('#id').text(), status: true};
      var id={id: $('#id').text()};
        $.ajax({
          url : "/endCycle",
          type: "POST",
          data : setData,
          success: function(data)
          {
            var text = JSON.stringify(data);
            obj = JSON.parse(text);
            console.log(obj.end);
            $('#spanStop').text(obj.end);
             window.location.href = '/chart/'+id.id;    
             
          },
          error: function (jqXHR, textStatus, errorThrown)
          {
       
          }
      });
   };
});

// PANEL COLLAPSED
$(document).on('click', '.panel-heading span.clickable', function(e){
  var $this = $(this);
  if(!$this.hasClass('panel-collapsed')) {
    $this.parents('.panel').find('.panel-body').slideUp();
    $this.addClass('panel-collapsed');
    $this.find('i').removeClass('fa-chevron-up').addClass('fa-chevron-down');
  } else {
    $this.parents('.panel').find('.panel-body').slideDown();
    $this.removeClass('panel-collapsed');
    $this.find('i').removeClass('fa-chevron-down').addClass('fa-chevron-up');
  }
});

function time(){
  d = new Date();
  datetext = d.toTimeString();
  datetext = datetext.split(' ')[0];
}

function printContent(el){
  var restorepage = document.body.innerHTML;
  $('#head').append('<h3 align="center">'+title.val()+'</h3><div align="center"><div class="col-xs-4"><strong>Ciclo: </strong><span>'+cycle.val()+start+'</span></div><div class="col-xs-4"><strong>Numero: </strong><span>'+$('#id').text()+'</span></div><div class="col-xs-4"><strong>Certificado N. : </strong><span>'+certificate.val()+'</span></div></div><br>');

  var printcontent = document.getElementById(el).innerHTML;
  document.body.innerHTML = printcontent;
  window.print();
  document.body.innerHTML = restorepage;
}
