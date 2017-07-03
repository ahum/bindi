Content =
  (Element / Text / binding)*

Element =
  startTag:StartTag content:Content endTag:EndTag {
    if (startTag.name != endTag) {
      throw new Error(
        "Expected </" + startTag + "> but </" + endTag + "> found."
      );
    }

    return {
      tag:    startTag.name,
      attributes: startTag.attr,
      content: content
    };
  }

StartTag =
  "<" name:TagName space? attr:attr* space? ">" { return {name: name,attr: attr}; }

space 
  = ' ' { return undefined }
  
attr
  = label:[a-z]* '="' value:(binding / stringValue) "\"" space? { return {label: label.join(''), value} }

binding
  = "{{" value:stringValue "}}" { return {type: 'binding', expr: value}}
  
stringValue
  = value:[a-z\.]* { return value.join('') }
  
EndTag =
  "</" name:TagName ">" _? { return name; }

TagName = chars:[a-z0-9-]+ { return chars.join(''); }

_ "whitespace"
  = [ \t\n\r]*
  
Text = chars:[^<{]+ _? { return chars.join(''); }