<?php

namespace App;

use App\Mail\RegisterUser;
use App\Models\Archivo;
use App\Models\GestionUsuario;
use App\Models\Municipio;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Http\Request;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Laravel\Passport\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'numero_identificacion','nombres','apellidos', 'email','genero', 'password','telefono','nivel_estudio','fecha_nacimiento','direccion','municipio_id', 'token_', 'victima_minas'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function municipio(){
        return $this->belongsTo(Municipio::class);
    }

    public function certificadoVictima(){
        return $this->belongsTo(Archivo::class, "certificado_victima_id");
    }

    public function consentimientoInformado(){
        return $this->belongsTo(Archivo::class, "consentimiento_informado_id");
    }    

    public static function rules(Request $request, $password = true){
        $rules = [
            "numero_identificacion"=>"required|min:6|max:10|digits_between:6,10|unique:users,numero_identificacion",
            "nombres"=>"required|min:3|max:60",
            "apellidos"=>"required|min:3|max:60",
            "email"=>"required|min:7|max:100|email|unique:users,email",
            "genero"=>"required|in:Masculino,Femenino",
            "nivel_estudio"=>"required",
            "fecha_nacimiento"=>"required|Date|before_or_equal:".date("Y-m-d",strtotime("-18 Years")),
            "direccion"=>"required|min:3|max:60",
            "municipio_id"=>"required",
            "certificado_victima"=>"nullable|file|max:1024|mimes:jpg,jpeg,png,pdf",
        ];

        //si el usuario es registrado por un administrador
        //el consentimiento informado es obligatorio
        if(Auth::user()->rol == "Administrador"){
            $rules["consentimiento_informado"] = "required|file|max:1024|mimes:jpg,jpeg,png,pdf";
        }

        if($password){
            $rules["password"] = "required|min:8|max:60|confirmed";
            $rules["password_confirmation"] = "required|min:8|max:60";
        }

        return $rules;
    }

    public static function register(Request $request, $generatePassword = false){
        $str_random = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
        $user = new User();
        $version_previa = $user->toJson();
        $user->fill($request->all());

        $user->victima_minas = $request->victima_minas == "true"?1:0;

        $pass = "";

        if(!$generatePassword)
            $user->password = Hash::make($request->password);

        for($i = 0; $i < rand(30,45);$i++){
            $user->token_ .= $str_random[rand(0, (strlen($str_random)-1))];
            if($generatePassword)
                $pass .= $str_random[rand(0, (strlen($str_random)-1))];
        }

        if($generatePassword)
            $user->password = Hash::make($pass);

        $user->save();

        if($request->hasFile('certificado_victima')){
            //almacenamiento de certificado de víctima del conflicto
            $fileCertificadoVictima = $request->file('certificado_victima');     

            $archivoCertificadoVictima = new Archivo();

            $archivoCertificadoVictima->fill([
                "nombre" => $fileCertificadoVictima->getClientOriginalName(),
                "nombre_archivo" => $fileCertificadoVictima->getClientOriginalName(),
                "ubicacion" => "empty",
                "metadatos" => null,        
            ]);

            $archivoCertificadoVictima->save();

            $ubicacion = "app/private/users/victim_certificates/".$user->id."/".$archivoCertificadoVictima->id;

            $archivoCertificadoVictima->ubicacion = $ubicacion;
            $archivoCertificadoVictima->save();
            $fileCertificadoVictima->move(storage_path($ubicacion), $fileCertificadoVictima->getClientOriginalName());

            $user->certificado_victima_id = $archivoCertificadoVictima->id;
            $user->save();
        }

        //si es administrador se debe subir el consentimiento informado
        if(Auth::check() && Auth::user()->rol == "Administrador"){
            $fileConsentimientoInformado = $request->file('consentimiento_informado');     

            $archivoConsentimientoInformado = new Archivo();

            $archivoConsentimientoInformado->fill([
                "nombre" => $fileConsentimientoInformado->getClientOriginalName(),
                "nombre_archivo" => $fileConsentimientoInformado->getClientOriginalName(),
                "ubicacion" => "empty",
                "metadatos" => null,        
            ]);

            $archivoConsentimientoInformado->save();

            $ubicacion = "app/private/users/informed_consent/".$user->id."/".$archivoConsentimientoInformado->id;

            $archivoConsentimientoInformado->ubicacion = $ubicacion;
            $archivoConsentimientoInformado->save();
            $fileConsentimientoInformado->move(storage_path($ubicacion), $fileConsentimientoInformado->getClientOriginalName());

            $user->consentimiento_informado_id = $archivoConsentimientoInformado->id;
            $user->save();
        }

        $version_nueva = $user->toJson();

        $log = new GestionUsuario();

        $log->fill([
            "fecha" => date("Y-m-d"),
            "accion" => "Crear",
            "version_previa" => $version_previa,
            "version_nueva" => $version_nueva,
            "usuario_admin_id" => Auth::check()?Auth::user()->id:null,
            "usuario_id" => $user->id,
        ]);

        $log->save();

        Mail::to($user)->send(new RegisterUser($user, $generatePassword, $pass));
        return $user;
    }
}
