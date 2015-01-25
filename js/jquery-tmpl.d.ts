interface JQuery
{
    tmpl(data?:any,options?:any): JQuery;
    tmplItem(): JQueryTmplItem;
    template(name?:string): ()=>any;
}

interface JQueryStatic
{
    tmpl(template:string,data?:any,options?:any): JQuery;
    tmpl(template:(data:any)=>string,data?:any,options?:any): JQuery;
    tmplItem(element:JQuery): JQueryTmplItem;
    tmplItem(element:HTMLElement): JQueryTmplItem;
    template(name:string,template:any): (data:any)=>string[];
    template(template:any): JQueryTemplateDelegate;
}

interface JQueryTemplateDelegate {
    (jQuery: JQueryStatic, data: any):string[];
}

interface JQueryTmplItem
{
    data:any;
    nodes:HTMLElement[];
    key:number;
    parent:JQueryTmplItem;
}
