Children =
  (Element / Text / OneWayBinding)*

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
  label:[a-z]* '="' value:(OneWayBinding / TwoWayBinding / StringValue) "\"" Space? { 
    if(value.expr){
      const out = {
        prop: label.join(''),
        expr: value.expr,
        type: value.type
      }
      if(value.type === 'two-way') {
        out.event = value.event;
      }
      return out;

    } else {
      return {
        label: label.join(''), 
        value} 
    }
  }

TwoWayBinding = 
  '{{' value:StringValue '::'? event:StringValue? '}}' { 
    const out = {
      type: 'two-way', 
      expr: value,
    }
    if(event && event !== '') {
      out.event = event;
    }

    return out;
  }
  
OneWayBinding = 
  '[[' value:StringValue ']]' { 
    return {
      type: 'one-way', 
      expr: value
    }
  }

StringValue = 
  value:[a-z\.]* { return value.join('') }
  
EndTag =
  '</' name:TagName '>' _? { return name; }

TagName = 
  chars:[a-z0-9-]+ { return chars.join('') }

_ 'whitespace' = 
  [ \t\n\r]*
  
Text = 
  chars:[^\[<{]+ _? { return chars.join('') }