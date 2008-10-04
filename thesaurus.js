function findSynonyms(word, callback) {
  var url = "http://services.aonaware.com/DictService/DictService.asmx/DefineInDict";
  var params = Utils.paramsToString({
    dictId: "moby-thes", //moby-thes: Moby Thesaurus II
    word: word
  });

  Utils.ajaxGet(url + params, function(xml) {
    CmdUtils.loadJQuery( function(jQuery) {
      var text = jQuery(xml).find("WordDefinition").text();
      callback(text);
    });
  });
}

CmdUtils.CreateCommand({
  name: "thesaurus",
  description: "Finds synonyms for a word.",
  author: { name: "Isidoros Passadis", email: "isidoros.passadis@gmail.com"},
  email: 'isidoros.passadis@gmail.com',
  license: "MPL",
  help: "Try typing &quot;thesaurus word&quot;",
  icon: "http://thesaurus.reference.com/favicon.ico",
  takes: {"word": noun_arb_text},
  execute: function( directObj ) {
    var word = directObj.text;
    Utils.openUrlInBrowser( "http://thesaurus.reference.com/search?q=" + escape(word) );
  },
  preview: function( pblock, directObj ) {
    var word = directObj.text;
    if (word.length < 2)
      pblock.innerHTML = "Finds synonyms for a word.";
    else {
      pblock.innerHTML = "Finds synonyms for the word " + word + ".";
      findSynonyms( word, function(text) {
        var content;
        var header;
        var body;
        
        header = text.substring(0, text.indexOf(":")+1);
        body = text.replace(header, "");

        var styles = '<style type="text/css">.content{ height: 100%; min-height: 140px; overflow: auto; position: relative; color: #000; background-color: #fff; border: 2px solid #ddd; -moz-border-radius: 15px 0 15px 0; z-index: 5;} .body  {position: relative; padding-top: 40px; padding-left: 50px; padding-right: 5px; max-height: 500px; overflow:auto;} .extra { position: absolute; left: -10px; top: -50px; color: #DDD; font-size: 10em; z-index: -1;} .header { position: absolute; right: 20px; color: #666; background-color: white; z-index: 10; } .word {color: darkorange; font-weight: bold;}</style>';

        header = header.replace(word, "<span class='word'>$&</span>");
        extra = '<div class="extra">thes</div>';
        if (text == "") {
          body = "No synonyms were found for the word <span class='word'>"+word+"</span>. Please check the spelling and try again.";
        }
        content = '<div class="content">'+extra+'<div class="header">'+header+'</div>'+'<div class="body">'+body+'</p></div>';
        pblock.innerHTML = styles+"\n"+content;
      });
    }
  }
});