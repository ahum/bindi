Children =
  (Element / Text / Binding)*

Element =
  startTag:StartTag children:Children endTag:EndTag {
    if (startTag.name != endTag) {
      throw new Error(
        "Expected </" + startTag + "> but </" + endTag + "> found."
      );
    }

    return {
      name: startTag.name,
      attributes: startTag.attributes,
      propertyBindings: startTag.propertyBindings,
      children
    };
  }

StartTag =
  "<" name:TagName Space? attributes:Attribute* Space? ">" { 

    var propertyBindings = attributes.filter(a => a.prop);
    var attr = attributes.filter(a => !a.prop);

    return {
      name, 
      attributes: attr,
      propertyBindings} 
    }

Space = 
  ' '
  
Attribute = 
  label:[a-z]* '="' value:(Binding / StringValue) "\"" Space? { 
    if(value.type && value.type === 'binding'){
      return {
        prop: label.join(''),
        expr: value.expr
      }
    } else {
      return {
        label: label.join(''), 
        value} 
    }
  }

Binding = 
  '{{' value:StringValue '}}' { return {type: 'binding', expr: value}}
  
Oneway = 
  '[[' value:StringValue ']]' { return {type: 'one-way-binding', expr: value}}

StringValue = 
  value:[a-z\.]* { return value.join('') }
  
EndTag =
  '</' name:TagName '>' _? { return name; }

TagName = 
  chars:[a-z0-9-]+ { return chars.join('') }

_ 'whitespace' = 
  [ \t\n\r]*
  
Text = 
  chars:[^<{]+ _? { return chars.join('') }