<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');header('Cache-Control: no-store');
function respond(int $code,array $body):never{http_response_code($code);echo json_encode($body,JSON_UNESCAPED_UNICODE);exit;}
if($_SERVER['REQUEST_METHOD']!=='POST')respond(405,['error'=>'method_not_allowed']);
$config=is_file(__DIR__.'/config.local.php')?require __DIR__.'/config.local.php':[];
if(!is_array($config)||empty($config['enabled'])||empty($config['privacy_ready'])||empty($config['bot_token'])||empty($config['chat_id']))respond(503,['error'=>'integration_not_configured']);
if(!function_exists('curl_init'))respond(503,['error'=>'transport_unavailable']);
if((int)($_SERVER['CONTENT_LENGTH']??0)>8192)respond(413,['error'=>'too_large']);
$origin=rtrim((string)($_SERVER['HTTP_ORIGIN']??''),'/');
if($origin===''||$origin!==rtrim((string)($config['app_url']??''),'/'))respond(403,['error'=>'invalid_origin']);
$raw=file_get_contents('php://input',false,null,0,8193);
if(strlen((string)$raw)>8192)respond(413,['error'=>'too_large']);
$data=json_decode((string)$raw,true);if(!is_array($data))respond(400,['error'=>'invalid_json']);
foreach(['contact','name','comment','object','deal','source','purpose','requestId','website','format'] as $field)if(isset($data[$field])&&!is_string($data[$field]))respond(422,['error'=>'invalid_fields']);
if(($data['consent']??false)!==true)respond(422,['error'=>'consent_required']);
if(($data['object']??'')==='open-space'){$data['object']='siluet';$data['format']='office';}
$format=$data['format']??'all';if(!in_array($format,['all','retail','office','building'],true))respond(422,['error'=>'invalid_format']);
$contact=trim($data['contact']??'');$object=$data['object']??'';$deal=$data['deal']??'all';$purpose=$data['purpose']??'conditions';$id=$data['requestId']??'';
if(!preg_match('/^(?:@[A-Za-z][A-Za-z0-9_]{4,31}|\+?[\d ()-]{7,24})$/D',$contact)||!in_array($object,['','siluet','kulman'],true)||!in_array($deal,['sale','rent','all'],true)||!in_array($purpose,['conditions','viewing','materials'],true)||!preg_match('/^[a-f0-9-]{36}$/D',$id)||strlen($data['name']??'')>240||strlen($data['comment']??'')>4500||!empty($data['website']))respond(422,['error'=>'invalid_fields']);
if(($object==='siluet'&&$format==='building')||($object==='kulman'&&!in_array($format,['all','building'],true))||($object===''&&$format!=='all'))respond(422,['error'=>'invalid_format']);
$store=$config['storage_dir']??'';if(!$store||!is_dir($store)||!is_writable($store))respond(503,['error'=>'storage_not_configured']);
$ip=hash('sha256',($_SERVER['REMOTE_ADDR']??'unknown').date('Y-m-d-H'));
$rate=fopen($store.'/rate-'.$ip,'c+');if(!$rate||!flock($rate,LOCK_EX))respond(503,['error'=>'storage_unavailable']);$count=(int)stream_get_contents($rate);if($count>=10){flock($rate,LOCK_UN);fclose($rate);respond(429,['error'=>'rate_limited']);}rewind($rate);ftruncate($rate,0);fwrite($rate,(string)($count+1));flock($rate,LOCK_UN);fclose($rate);
$receipt=fopen($store.'/request-'.hash('sha256',$id),'c+');if(!$receipt||!flock($receipt,LOCK_EX))respond(503,['error'=>'storage_unavailable']);if(trim(stream_get_contents($receipt))==='sent'){flock($receipt,LOCK_UN);fclose($receipt);respond(200,['ok'=>true]);}
date_default_timezone_set('Europe/Minsk');$objects=[''=>'Помогите выбрать','siluet'=>'ТЦ Силуэт','kulman'=>'Кульман, 1к4'];$deals=['all'=>'Покупка или аренда','sale'=>'Покупка','rent'=>'Аренда'];$source=$data['source']??'/';if(!preg_match('~^/[a-z0-9/_-]{0,180}$~D',$source))$source='/';
$formats=['all'=>'Уточнить','retail'=>'Торговое помещение','office'=>'Офис Open Space','building'=>'Здание'];
$text="Недвижимость Минск · заявка\n".date('d.m.Y H:i')."\nID: ".$id."\nОбъект: ".$objects[$object]."\nФормат: ".$formats[$format]."\nИнтерес: ".$deals[$deal]."\nЦель: ".($purpose==='viewing'?'Просмотр':($purpose==='materials'?'Материалы':'Условия'))."\nКонтакт: ".$contact."\nИмя: ".trim($data['name']??'')."\nКомментарий: ".trim($data['comment']??'')."\nСтраница: ".$source;
$payload=['chat_id'=>$config['chat_id'],'text'=>$text];if(!empty($config['message_thread_id']))$payload['message_thread_id']=$config['message_thread_id'];
$curl=curl_init('https://api.telegram.org/bot'.$config['bot_token'].'/sendMessage');curl_setopt_array($curl,[CURLOPT_POST=>true,CURLOPT_POSTFIELDS=>json_encode($payload,JSON_UNESCAPED_UNICODE),CURLOPT_HTTPHEADER=>['Content-Type: application/json'],CURLOPT_RETURNTRANSFER=>true,CURLOPT_CONNECTTIMEOUT=>5,CURLOPT_TIMEOUT=>15,CURLOPT_SSL_VERIFYPEER=>true,CURLOPT_SSL_VERIFYHOST=>2]);$result=curl_exec($curl);$code=curl_getinfo($curl,CURLINFO_HTTP_CODE);curl_close($curl);$ok=$code===200&&is_string($result)&&!empty(json_decode($result,true)['ok']);if($ok){rewind($receipt);ftruncate($receipt,0);fwrite($receipt,'sent');}flock($receipt,LOCK_UN);fclose($receipt);respond($ok?200:502,$ok?['ok'=>true]:['error'=>'delivery_failed']);
