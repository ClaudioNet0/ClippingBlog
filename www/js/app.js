var codeEditor = null;

function mensagem_erro(mensagem) {
    var html = '';
    html += "";
}

function artigo_visualizar(artigo) {
    $("#artigo-titulo").html( artigo.titulo );
    var html = '<div class="form-span">';
    $.each(artigo.tags_lista, function( index, value ) {
        html += '<a href="/blog/tag/' + value + '"><span class="badge badge-info">' + value + '</span></a> ';
    });
    html += '</div>';
    $("#artigo-tags").html( html );
    $("#artigo-data").html( "<div class='form-span'>" + artigo.data_str + '</div>' );
    $("#artigo-autor").html("<div class='form-span'>" +  artigo.autor + '</div>' );
    $("#artigo-texto").html( artigo.texto );
    $("#artigo-botao").hide();
}

function artigo_editar(artigo) {
    $("#artigo-titulo").html("<input type='text' id='titulo' name='titulo' class='form-control input-lg' />");
    $("#artigo-tags").html( html_tags_input() );
    $("#artigo-data").html( html_data_input() );
    $("#artigo-autor").html( html_autor_input() );
    $("#artigo-texto").html( html_texto_input() );
    $("#artigo-botao").show();

    $("#titulo").val(artigo.titulo);
    $('#data').datepicker({
        format: "dd/mm/yyyy",
        language: "pt-BR"
    });
    $("#data").val(artigo.data_min);
    $("#autor").val(artigo.autor);
    $("#cod_situacao").val(artigo.cod_situacao);

    //$("#texto").wysihtml5();
    codeEditor = CodeMirror(document.getElementById("texto"), {
        mode: "text/html",
        extraKeys: {"Ctrl-Space": "autocomplete"},
        lineNumbers: true,
        lineWrapping: true,
        matchBrackets: true,
        value: artigo.texto
    });
    $("#tags").val(artigo.tags);
    $("#tags").tagsinput({
        allowDuplicates: false,
        tagClass: 'label label-default'
    });
}

function html_tags_input() {
    var html = "";
    html += "<input id='tags' name='tags' class='form-control' type='text' value='' />";
    return html;
}

function html_data_input() {
    var html = "";
    html += "<div class='input-group'>";
    html += "<div class='input-group-addon'><i class='fa fa-clock-o'></i></div>";
    html += "<input type='text' id='data' name='data' class='form-control' placeholder='Preencha a data' />";
    html += "</div>";
    return html;
}

function html_autor_input() {
    var html = "";
    html += "<div class='input-group'>";
    html += "<div class='input-group-addon'><i class='fa fa-user'></i></div>";
    html += "<input type='text' id='autor' name='autor' class='form-control' placeholder='Preencha o autor' />";
    html += "</div>";
    return html;
}

function html_texto_input() {
    var html = "";
    //html += "<textarea id='texto' name='texto' class='form-control'></textarea>";
    html += "<div id='texto'></div>";
    return html;
}

$(document).ready(function() {
    $(".artigo-alterar").click(function (e) {
        e.preventDefault();

        var id_artigo = $(this).attr("data-artigo");

        var $btn = $(this);
        $btn.button('loading');
        $.ajax({
            method: "PUT",
            dataType: "json",
            url: "/api/ArtigoBLL/pegar",
            data: id_artigo,
            success: function (artigo) {
                if (artigo) {
                    artigo_editar(artigo);
                }
                $btn.button('reset');
            },
            error: function (request, status, error) {
                $btn.button('reset');
                alert(request.responseText);
            }
        });

       return false;
    });
    $("#artigo-gravar").click(function (e) {
        e.preventDefault();

        var id_artigo = $(this).attr("data-artigo");
        var artigo = {
            id_artigo: id_artigo,
            titulo: $("#titulo").val(),
            data: $("#data").val(),
            autor: $("#autor").val(),
            texto: codeEditor.getValue(),
            cod_situacao: $("#cod_situacao").val(),
            tags: $("#tags").val()
        };

        var $btn = $(this);
        $btn.button('loading');
        $.ajax({
            method: "PUT",
            dataType: "json",
            url: "/api/ArtigoAPI/alterar",
            data: JSON.stringify(artigo),
            success: function (data) {
                if (data && data.error) {
                    alert(data.error);
                    $btn.button('reset');
                }
                else {
                    $.ajax({
                        method: "PUT",
                        dataType: "json",
                        url: "/api/ArtigoBLL/pegar",
                        data: id_artigo,
                        success: function (artigo) {
                            if (artigo) {
                                artigo_visualizar(artigo);
                            }
                            $btn.button('reset');
                        },
                        error: function (request, status, error) {
                            $btn.button('reset');
                            alert(request.responseText);
                        }
                    });
                }
            },
            error: function (request, status, error) {
                $btn.button('reset');
                alert(request.responseText);
            }
        });
        return false;
    });

    $("#artigo-cancelar").click(function (e) {
        e.preventDefault();

        var id_artigo = $(this).attr("data-artigo");
        var $btn = $(this);
        $btn.button('loading');
        $.ajax({
            method: "PUT",
            dataType: "json",
            url: "/api/ArtigoBLL/pegar",
            data: id_artigo,
            success: function (artigo) {
                if (artigo) {
                    artigo_visualizar(artigo);
                }
                $btn.button('reset');
            },
            error: function (request, status, error) {
                $btn.button('reset');
                alert(request.responseText);
            }
        });
        return false;
    });
});