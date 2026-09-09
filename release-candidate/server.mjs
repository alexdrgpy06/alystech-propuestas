import http from 'node:http';import{readFile}from'node:fs/promises';import{resolve,extname}from'node:path';import{renderPdf}from'./pdf.mjs';
const root=resolve('dist'),port=Number(process.env.PORT||5182),demo=process.env.DEMO==='1';
http.createServer(async(req,res)=>{try{const url=new URL(req.url,'http://localhost');
 if(req.method==='POST'&&url.pathname==='/api/pdf'){let body='';for await(const c of req){body+=c;if(body.length>1000000){res.writeHead(413);res.end('Payload too large');return}}const {proposal,selections,extras}=JSON.parse(body);const pdf=await renderPdf(proposal,selections,extras,demo||url.searchParams.has('demo'));res.writeHead(200,{'Content-Type':'application/pdf','Content-Disposition':'attachment; filename="proposal.pdf"','Cache-Control':'no-store'});res.end(pdf);return}
 if(req.method!=='GET'){res.writeHead(405);res.end();return}
 if(demo&&url.pathname==='/'&&!url.searchParams.has('demo')){res.writeHead(302,{Location:'/?demo=1'});res.end();return}
 const path=resolve(root,'.'+decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname));if(!path.startsWith(root+'\\')&&!path.startsWith(root+'/')){res.writeHead(403);res.end();return}
 const data=await readFile(path);res.writeHead(200,{'Content-Type':{'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css'}[extname(path)]||'application/octet-stream','X-Content-Type-Options':'nosniff'});res.end(data)
 }catch(e){res.writeHead(req.method==='POST'?400:404,{'Content-Type':'text/plain'});res.end(req.method==='POST'?'Invalid proposal or PDF request':'Not found')}}).listen(port,'127.0.0.1',()=>console.log(`Proposal Builder http://127.0.0.1:${port}${demo?'/?demo=1':''}`));
