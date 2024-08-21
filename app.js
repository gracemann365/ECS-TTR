document.getElementById('convertButton').addEventListener('click', function () {
    const inputFormat = document.getElementById('inputFormat').value;
    const outputFormat = document.getElementById('outputFormat').value;
    const inputText = document.getElementById('input').value;

    let convertedData;
// A  NESTED TRY CATCH TO CHECK WHAT TO CONVERT FROM WHERE ?
    try {
        if (inputFormat === 'json') {
            const jsonData = JSON.parse(inputText);

            if (outputFormat === 'csv') {
                convertedData = jsonToCsv(jsonData);
            } else if (outputFormat === 'xml') {
                convertedData = jsonToXml(jsonData);
            } else if (outputFormat === 'yaml') {
                convertedData = jsonToYaml(jsonData);
            } else {
                convertedData = JSON.stringify(jsonData, null, 2);
            }

            document.getElementById('output').value = convertedData;
        } else if (inputFormat === 'csv') {
            if (outputFormat === 'json') {
                convertedData = csvToJson(inputText);
            } else if (outputFormat === 'xml') {
                convertedData = csvToXml(inputText);
            } else if (outputFormat === 'yaml') {
                convertedData = csvToYaml(inputText);
            } else {
                convertedData = inputText;
            }

            document.getElementById('output').value = convertedData;
        } else if (inputFormat === 'xml') {
            const xmlData = (new window.DOMParser()).parseFromString(inputText, "text/xml");

            if (outputFormat === 'json') {
                convertedData = xmlToJson(xmlData);
            } else if (outputFormat === 'csv') {
                convertedData = xmlToCsv(xmlData);
            } else if (outputFormat === 'yaml') {
                convertedData = xmlToYaml(xmlData);
            } else {
                convertedData = new XMLSerializer().serializeToString(xmlData);
            }

            document.getElementById('output').value = convertedData;
        } else if (inputFormat === 'yaml') {
            if (outputFormat === 'json') {
                convertedData = yamlToJson(inputText);
            } else if (outputFormat === 'csv') {
                convertedData = yamlToCsv(inputText);
            } else if (outputFormat === 'xml') {
                convertedData = yamlToXml(inputText);
            } else {
                convertedData = inputText;
            }

            document.getElementById('output').value = convertedData;
        } else {
            document.getElementById('output').value = 'Unsupported input format.';
        }
    } catch (error) {
        document.getElementById('output').value = 'Error: ' + error.message;
    }
});

//JSON SUPREMACY CODE SECTION 
/* TEST DATA PLEASE USE THIS 
[
    {
        "name": "John Doe",
        "age": "30",
        "city": "New York"
    },
    {
        "name": "Jane Smith",
        "age": "25",
        "city": "Los Angeles"
    }
] */

// JSON to CSV
function jsonToCsv(json) {
    if (!Array.isArray(json)) {
        throw new Error('Input JSON must be an array');
    }

    const array = json;
    if (array.length === 0) return '';

    let result = '';
    const headers = Object.keys(array[0]);
    result += headers.join(',') + '\n';

    array.forEach(item => {
        const row = headers.map(header => JSON.stringify(item[header], replacer)).join(',');
        result += row + '\n';
    });

    return result;
}

// JSON to XML
function jsonToXml(json) {
    const jsonObj = typeof json !== 'object' ? JSON.parse(json) : json;
    let xml = '';

    function parseObject(obj, rootElement) {
        xml += `<${rootElement}>`;
        for (const prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                if (typeof obj[prop] === 'object') {
                    parseObject(obj[prop], prop);
                } else {
                    xml += `<${prop}>${obj[prop]}</${prop}>`;
                }
            }
        }
        xml += `</${rootElement}>`;
    }

    parseObject(jsonObj, 'root');
    return xml;
}


// Optional: Replace function for JSON.stringify
function replacer(key, value) {
    return value === null ? '' : value;
}

//CSV SUPREMACY CODE SECTION 
//TEST DATA
/*
name,age,city 
John Doe,30,New York 
Jane Smith,25,Los Angeles
 */
// CSV to JSON
function csvToJson(csv) {
    // Check if input is not empty and handle it properly
    if (!csv || csv.trim() === '') {
        throw new Error('CSV input is empty or invalid.');
    }

    const lines = csv.split('\n').filter(line => line.trim() !== '');
    const headers = lines[0].split(',').map(header => header.trim());
    const result = [];

    for (let i = 1; i < lines.length; i++) {
        const obj = {};
        const currentLine = lines[i].split(',').map(cell => cell.trim());
        headers.forEach((header, index) => {
            obj[header] = currentLine[index] || '';
        });
        result.push(obj);
    }

    return JSON.stringify(result, null, 2);
}

// CSV to XML
function csvToXml(csv) {
    if (!csv || csv.trim() === '') {
        throw new Error('CSV input is empty or invalid.');
    }

    const lines = csv.split('\n').filter(line => line.trim() !== '');
    const headers = lines[0].split(',').map(header => header.trim());
    let xml = '<?xml version="1.0" encoding="UTF-8"?><root>';

    for (let i = 1; i < lines.length; i++) {
        const obj = {};
        const currentLine = lines[i].split(',').map(cell => cell.trim());
        headers.forEach((header, index) => {
            obj[header] = currentLine[index] || '';
        });

        xml += '<row>';
        for (const [key, value] of Object.entries(obj)) {
            xml += `<${key}>${value}</${key}>`;
        }
        xml += '</row>';
    }

    xml += '</root>';
    return xml;
}

//XML SUPREMACY CODE SECTION 

//TEST DATA

/**
 * 
 <root>
    <row>
        <name>John Doe</name>
        <age>30</age>
        <city>New York</city>
    </row>
    <row>
        <name>Jane Smith</name>
        <age>25</age>
        <city>Los Angeles</city>
    </row>
</root>

 */



// Function to convert XML to JSON
function xmlToJson(xml) {
    // Ensure the XML is not empty and valid
    if (!xml || !xml.documentElement) {
        throw new Error('Invalid XML input');
    }

    // Convert the XML document to JSON format
    const obj = xmlToJsonRecursive(xml.documentElement);

    // If the JSON object contains a single top-level node, convert it to an array
    if (Object.keys(obj).length === 1 && Array.isArray(obj[Object.keys(obj)[0]])) {
        return JSON.stringify(obj[Object.keys(obj)[0]], null, 2);
    } else {
        return JSON.stringify([obj], null, 2); // Wrap single object in array
    }
}

// Recursive function to convert XML node to JSON
function xmlToJsonRecursive(node) {
    let obj = {};

    if (node.nodeType === 1) { // Element node
        // Process attributes
        if (node.attributes.length > 0) {
            obj['@attributes'] = {};
            for (let i = 0; i < node.attributes.length; i++) {
                const attribute = node.attributes.item(i);
                obj['@attributes'][attribute.nodeName] = attribute.nodeValue;
            }
        }

        // Process child nodes
        if (node.hasChildNodes()) {
            for (let i = 0; i < node.childNodes.length; i++) {
                const item = node.childNodes.item(i);
                const nodeName = item.nodeName;

                if (item.nodeType === 1) { // Process element nodes
                    if (typeof(obj[nodeName]) === 'undefined') {
                        obj[nodeName] = xmlToJsonRecursive(item);
                    } else {
                        if (!Array.isArray(obj[nodeName])) {
                            const old = obj[nodeName];
                            obj[nodeName] = [];
                            obj[nodeName].push(old);
                        }
                        obj[nodeName].push(xmlToJsonRecursive(item));
                    }
                } else if (item.nodeType === 3) { // Process text nodes
                    const textContent = item.textContent || item.nodeValue;
                    if (textContent.trim()) {
                        obj = textContent.trim(); // Store trimmed text value
                    }
                }
            }
        }
    }

    return obj;
}

//  XML to CSV
function xmlToCsv(xml) {
    // Convert XML to JSON
    const json = xmlToJson(xml);
    
    // Parse JSON to array of objects
    let jsonArray;
    try {
        jsonArray = JSON.parse(json);
    } catch (error) {
        throw new Error('Failed to parse JSON from XML');
    }
    
    if (!Array.isArray(jsonArray)) {
        throw new Error('Invalid JSON format. Expected an array.');
    }

    // Convert JSON to CSV
    return jsonToCsv(jsonArray);
}
