pm.visualizer.set(
    `
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">

        {{#each response}}
            <h2>{{stopName}}</h2>
            {{mode}}|{{headsign}}|{{transportName}}

            <table bgcolor="#FFFFFF" border="2">
            {{#each nearby}}
            <tr>
                <td>{{name}}</td>
                <td>{{stars}} stars of 5</td>
                <td>{{review_count}} Yelp reviews</td>
                <td>{{coins}} Yelp dollar signs</td>
                <td>{{categories}}</td>
                <td>{{transactions}}</td>
                <td><img src={{image}} width="100" height="100" display="inline"></img></td>
                <td>{{address}}</td>
                <td>{{lat}}, {{long}}</td>
                <td>{{distance}} meters</td>
                <td>{{link}}</td>
            </tr>
            {{/each}}
            </table>

        {{/each}}
    `
    ,
    {
        response: aggregateResults
    }
);
