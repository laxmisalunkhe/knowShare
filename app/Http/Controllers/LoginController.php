<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateLoginRequest;
use App\User;
use Auth;
use Request;
use Response;
use Session;

class LoginController extends Controller
{
    /**
     * [auth description]
     * @return [type] [description]
     */
    public function auth()
    {
        $rowInput =Request::all();
        // dd($rowInput);
        // $input = \Request::only('customer.email', 'customer.password');
        //if(Auth::attempt(array_get($input, 'customer')))
        if(Auth::attempt(['email'=>$rowInput['email'], 'password'=>$rowInput['password']]))
        {
            // echo "hello in";
            $getRole  = User::where('email',$rowInput['email'])->first();
            $getRole  = $getRole['role_id'];
            return \Response::json(['status'=>'success','email'=>$rowInput['email'],'roleId'=>$getRole,'url'=>'http://localhost/knowShare/dashboard']);
              // return "success";
        } else {
            return \Response::json(['status'=>'fail']);
        }
    }

    /**
     * [getCurrentUser description]
     * @return [type] [description]
     */
    public function getCurrentUser(){
        // $getUserInfo = User::where('id', Auth::User()->id)->get();
        $getUserInfo = User::where('id', 2)->firstOrFail();
        // dd($getUserInfo);
        if($getUserInfo['role_id'] == 2){
            // $extendedInfo = User::find(2)->seeker;
            $extendedInfo = User::with('seeker')->get();
            // dd($extendedInfo);
            return response()->json(['status' => '200', 'data' => $extendedInfo]); 
        }else{
            $extendedInfo = User::with('trainer')->get();
            return response()->json(['status' => '200', 'data' => $extendedInfo]); 

        }
    }
}
