'use strict';  


var RequestCanvas = prepareRequestCanvas(
    'https://kth.instructure.com/api/v1'
);


function prepareRequestCanvas(baseUrl) {
    return(relUrlObj) => {
        return new Promise((resolve, reject) => {
            const request = new XMLHttpRequest();
            request.open('GET', baseUrl + '/' + relUrlObj.area + '/' + relUrlObj.areaId + '/' + relUrlObj.what + '?per_page=' + relUrlObj.perPage + '&access_token=' + relUrlObj.token);
            request.responseType = 'application/json';
            request.send();
            //console.log(baseUrl + '/' + relUrl);
            request.onload = () => resolve(JSON.parse(request.response));
        })
    };
};







document.addEventListener("DOMContentLoaded", function () {
    

    
    
        // var canvasData = {};
        // let searchObj = {
        //     area: "users",
        //     areaId: "5091",
        //     what: "courses",
        //     perPage: "100",
        //     token: "8779~3LmsZZse4dRnHvdnYBRt69Yc5dTFDApw1FlZCP49T4o6xIDsVXrKZ122VQFiopCh"
        // }
        // RequestCanvas(searchObj).then((objs) => {
    
        //     canvasData = objs;
    
        //     canvasData.forEach(function(item) {
        //         //console.log("KURS" + item.id);
        //         let searchObj = {
        //             area: "courses",
        //             areaId: item.id,
        //             what: "group_categories",
        //             perPage: "100",
        //             token: "8779~3LmsZZse4dRnHvdnYBRt69Yc5dTFDApw1FlZCP49T4o6xIDsVXrKZ122VQFiopCh"
        //         }
        //         RequestCanvas(searchObj).then((objs) => {
    
        //             objs.forEach(function(product) {
        //                 //console.log("KURS");
        //                 //console.log(product);
        //             });
    
        //             item.group_categories = objs;
    
        
        //             objs.forEach(function(item) {
        //                 let searchObj = {
        //                     area: "group_categories",
        //                     areaId: item.id,
        //                     what: "groups",
        //                     perPage: "100",
        //                     token: "8779~3LmsZZse4dRnHvdnYBRt69Yc5dTFDApw1FlZCP49T4o6xIDsVXrKZ122VQFiopCh"
        //                 }
        //                 RequestCanvas(searchObj).then((objs) => {
        //                     objs.forEach(function(product) {
        //                         //console.log("KURS");
        //                         //console.log(product);
        //                     });
    
        //                     item.groups = objs;
    
                            
    
                            
        //                     objs.forEach(function(item) {
        //                         let searchObj = {
        //                             area: "groups",
        //                             areaId: item.id,
        //                             what: "users",
        //                             perPage: "100",
        //                             token: "8779~3LmsZZse4dRnHvdnYBRt69Yc5dTFDApw1FlZCP49T4o6xIDsVXrKZ122VQFiopCh"
        //                         }
        //                         RequestCanvas(searchObj).then((objs) => {
        //                             objs.forEach(function(product) {
        //                                 //console.log("KURS");
        //                                 //console.log(product);
        //                             });
                                    
        //                             item.users = objs;
        //                         }).catch(function() {
        //                             console.log("HITTAR INTE GROUP");
        //                         });
        //                     });
                            
            
        //                 }).catch(function() {
        //                     console.log("HITTAR INTE GROUP CATEGORY");
        //                 });
        //             });
                    
        
        
        
        //         }).catch(function() {
        //             console.log("HITTAR INTE KURS");
        //         });
    
        
    
        //     });
    
    
            
    
            
    
    
        //     console.log(canvasData);
    
        // }).catch(function() {
        //     console.log("HITTAR INTE KURSER");
        // });
    
        var canvasData = {};
        var searchObj = {
            area: "users",
            areaId: "5091",
            what: "courses",
            perPage: "100",
            token: "8779~3LmsZZse4dRnHvdnYBRt69Yc5dTFDApw1FlZCP49T4o6xIDsVXrKZ122VQFiopCh"
        }

        var fn = function canvasUsersGetter(item) {
            let searchObj = {
                area: "courses",
                areaId: item.id,
                what: "group_categories",
                perPage: "100",
                token: "8779~3LmsZZse4dRnHvdnYBRt69Yc5dTFDApw1FlZCP49T4o6xIDsVXrKZ122VQFiopCh"
            }

            return RequestCanvas(searchObj);
        }


        var fn2 = function canvasUsersGetter2(item) {
            console.log(item);
            
            let searchObj = {
                area: "group_categories",
                areaId: item.id,
                what: "groups",
                perPage: "100",
                token: "8779~3LmsZZse4dRnHvdnYBRt69Yc5dTFDApw1FlZCP49T4o6xIDsVXrKZ122VQFiopCh"
            }

            return RequestCanvas(searchObj);
        }

        function flatten(arr) {
            return arr.reduce(function (flat, toFlatten) {
              return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
            }, []);
          }


        RequestCanvas(searchObj).then((objs) => {
            

            var actions = flatten(objs).map(fn);
            var results = Promise.all(actions);
    
            results.then((objs) => {
                //console.log(flatten(objs));
                console.log('XXXXXXXXX');
                var actions2 = flatten(objs).map(fn2);
                var results2 = Promise.all(actions2);

                results2.then(objs => {
                    let el = document.getElementById('courses');
                    let innerEl = document.createElement('div');
                    innerEl.innerHTML = JSON.stringify(objs);
                    el.appendChild(innerEl);
                });
        });
    
        
    
        
    
    
    });